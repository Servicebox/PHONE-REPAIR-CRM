const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    path: {
        type: String,
        default: ''
    },
    level: {
        type: Number,
        default: 0
    },
    description: String,
}, {
    timestamps: true
});

// Уникальность имени в рамках родительской категории
categorySchema.index({ parent: 1, name: 1 }, { unique: true });

// Middleware для построения пути
categorySchema.pre('save', async function (next) {
    if (this.isModified('parent')) {
        if (this.parent) {
            const parent = await mongoose.model('Category').findById(this.parent);
            this.path = parent.path ? `${parent.path}/${parent._id}` : parent._id.toString();
            this.level = parent.level + 1;
        } else {
            this.path = '';
            this.level = 0;
        }
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);