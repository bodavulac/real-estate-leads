import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  investmentType: 'Plot' | 'Villa' | 'Apartment' | 'Commercial';
  budget: string;
  timeline: string;
  location?: string;
  source?: string;
  notes?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Interested' | 'Not Interested' | 'Converted';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo?: string;
  lastContactDate?: Date;
  nextFollowUp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [15, 'Phone number cannot exceed 15 characters']
  },
  investmentType: {
    type: String,
    required: [true, 'Investment type is required'],
    enum: {
      values: ['Plot', 'Villa', 'Apartment', 'Commercial'],
      message: 'Investment type must be one of: Plot, Villa, Apartment, Commercial'
    }
  },
  budget: {
    type: String,
    required: [true, 'Budget is required'],
    trim: true,
    maxlength: [50, 'Budget cannot exceed 50 characters']
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is required'],
    trim: true,
    maxlength: [100, 'Timeline cannot exceed 100 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  source: {
    type: String,
    trim: true,
    maxlength: [50, 'Source cannot exceed 50 characters'],
    default: 'Website'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['New', 'Contacted', 'Qualified', 'Interested', 'Not Interested', 'Converted'],
      message: 'Status must be one of: New, Contacted, Qualified, Interested, Not Interested, Converted'
    },
    default: 'New'
  },
  priority: {
    type: String,
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: 'Priority must be one of: Low, Medium, High'
    },
    default: 'Medium'
  },
  assignedTo: {
    type: String,
    trim: true,
    maxlength: [100, 'Assigned to cannot exceed 100 characters']
  },
  lastContactDate: {
    type: Date
  },
  nextFollowUp: {
    type: Date
  }
}, {
  timestamps: true
});

LeadSchema.index({ email: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ investmentType: 1 });
LeadSchema.index({ priority: 1 });
LeadSchema.index({ assignedTo: 1 });

export default mongoose.model<ILead>('Lead', LeadSchema);