const express = require('express');
const router = express.Router();
const multer = require('multer');
const Service = require('../models/Service');

// Configuração do multer para armazenamento em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper para converter arquivos para base64 (aqui você pode armazenar em links externos como Cloudinary)
const processFilesToBase64 = (files) => files.map((file) => file.buffer.toString('base64'));

// Criar um novo serviço
router.post(
  '/',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name || !description || !req.files?.coverImage?.length) {
        return res.status(400).json({
          error: 'Os campos "name", "description" e "coverImage" são obrigatórios.',
        });
      }

      // Convertendo imagens para base64
      const coverImage = processFilesToBase64(req.files.coverImage)[0];
      const additionalImages = req.files.additionalImages
        ? processFilesToBase64(req.files.additionalImages)
        : [];

      const service = new Service({ name, description, coverImage, additionalImages });
      const savedService = await service.save();
      res.status(201).json(savedService);
    } catch (error) {
      console.error('Erro ao criar serviço:', error.message);
      res.status(500).json({ error: 'Erro ao criar serviço.' });
    }
  }
);

// Atualizar um serviço existente
router.put(
  '/:id',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { name, description, removedAdditionalImages } = req.body;

      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ error: 'Serviço não encontrado.' });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;

      // Atualizar imagem de capa se enviada
      if (req.files?.coverImage?.length) {
        updateData.coverImage = processFilesToBase64(req.files.coverImage)[0];
      }

      // Atualizando imagens adicionais
      let additionalImages = service.additionalImages || [];

      // Remover imagens marcadas para exclusão
      if (removedAdditionalImages) {
        try {
          const indexesToRemove = JSON.parse(removedAdditionalImages);
          additionalImages = additionalImages.filter((_, index) => !indexesToRemove.includes(index));
        } catch {
          return res.status(400).json({ error: 'O campo "removedAdditionalImages" deve ser um JSON válido.' });
        }
      }

      // Adicionar novas imagens
      if (req.files?.additionalImages?.length) {
        const newImages = processFilesToBase64(req.files.additionalImages);
        additionalImages = [...additionalImages, ...newImages];
      }

      updateData.additionalImages = additionalImages;

      const updatedService = await Service.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      res.status(200).json(updatedService);
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error.message);
      res.status(500).json({ error: 'Erro ao atualizar serviço.' });
    }
  }
);

// Endpoint para servir imagens
router.get('/image/:id/coverImage', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service || !service.coverImage) {
      return res.status(404).json({ error: 'Imagem não encontrada.' });
    }
    const imgBuffer = Buffer.from(service.coverImage, 'base64');
    res.set('Content-Type', 'image/jpeg');
    res.send(imgBuffer);
  } catch (error) {
    console.error('Erro ao buscar imagem:', error.message);
    res.status(500).json({ error: 'Erro ao buscar imagem.' });
  }
});

router.get('/image/:id/additionalImages/:index', async (req, res) => {
  try {
    const { id, index } = req.params;
    const service = await Service.findById(id);
    if (!service || !service.additionalImages[index]) {
      return res.status(404).json({ error: 'Imagem adicional não encontrada.' });
    }
    const imgBuffer = Buffer.from(service.additionalImages[index], 'base64');
    res.set('Content-Type', 'image/jpeg');
    res.send(imgBuffer);
  } catch (error) {
    console.error('Erro ao buscar imagem adicional:', error.message);
    res.status(500).json({ error: 'Erro ao buscar imagem adicional.' });
  }
});

// Listar todos os serviços
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error.message);
    res.status(500).json({ error: 'Erro ao buscar serviços.' });
  }
});

// Deletar um serviço
router.delete('/:id', async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ error: 'Serviço não encontrado.' });
    }
    res.status(200).json({ message: 'Serviço excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir serviço:', error.message);
    res.status(500).json({ error: 'Erro ao excluir serviço.' });
  }
});

module.exports = router;
