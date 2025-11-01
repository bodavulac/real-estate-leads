# updated by chakradhar on 1-Nov-25
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Parser } from 'json2csv';
import Lead, { ILead } from '../models/Lead';

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    const { name, email, phone, investmentType, budget, timeline, location, notes, status, priority, assignedTo } = req.body;

    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      res.status(409).json({
        success: false,
        message: 'A lead with this email already exists'
      });
      return;
    }

    const lead = new Lead({
      name,
      email,
      phone,
      investmentType,
      budget,
      timeline,
      location,
      notes,
      status,
      priority,
      assignedTo
    });

    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: {
        id: lead._id,
        name: lead.name,
        email: lead.email,
        investmentType: lead.investmentType,
        createdAt: lead.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const investmentType = req.query.investmentType as string;
    const priority = req.query.priority as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) filter.status = status;
    if (investmentType) filter.investmentType = investmentType;
    if (priority) filter.priority = priority;

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const leads = await Lead.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLeads: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      filters: {
        search,
        status,
        investmentType,
        priority,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id).select('-__v');
    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const lead = await Lead.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const exportLeadsToCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string;
    const status = req.query.status as string;
    const investmentType = req.query.investmentType as string;
    const priority = req.query.priority as string;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) filter.status = status;
    if (investmentType) filter.investmentType = investmentType;
    if (priority) filter.priority = priority;

    const leads = await Lead.find(filter).select('-__v').sort({ createdAt: -1 });

    const csvFields = [
      'name',
      'email',
      'phone',
      'investmentType',
      'budget',
      'timeline',
      'location',
      'status',
      'priority',
      'assignedTo',
      'source',
      'notes',
      'lastContactDate',
      'nextFollowUp',
      'createdAt',
      'updatedAt'
    ];

    const parser = new Parser({ fields: csvFields });
    const csv = parser.parse(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=leads-${new Date().toISOString().split('T')[0]}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting leads to CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getLeadAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalLeads = await Lead.countDocuments();

    const statusStats = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const investmentTypeStats = await Lead.aggregate([
      { $group: { _id: '$investmentType', count: { $sum: 1 } } }
    ]);

    const priorityStats = await Lead.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const monthlyLeads = await Lead.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const conversionRate = totalLeads > 0
      ? ((await Lead.countDocuments({ status: 'Converted' })) / totalLeads * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        conversionRate: `${conversionRate}%`,
        statusBreakdown: statusStats,
        investmentTypeBreakdown: investmentTypeStats,
        priorityBreakdown: priorityStats,
        monthlyTrends: monthlyLeads
      }
    });
  } catch (error) {
    console.error('Error fetching lead analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
