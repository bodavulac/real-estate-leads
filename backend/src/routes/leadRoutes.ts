import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsToCSV,
  getLeadAnalytics
} from '../controllers/leadController';
import { validateCreateLead, validateUpdateLead } from '../middleware/validation';

const router = express.Router();

router.post('/', validateCreateLead, createLead);

router.get('/', getLeads);

router.get('/export/csv', exportLeadsToCSV);

router.get('/analytics', getLeadAnalytics);

router.get('/:id', getLeadById);

router.put('/:id', validateUpdateLead, updateLead);

router.delete('/:id', deleteLead);

export default router;