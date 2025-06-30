import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox,
    Collapse, Chip, Tooltip, ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import {
    Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
    Folder as FolderIcon, FolderOpen as FolderOpenIcon,
    Category as CategoryIcon, ShoppingBasket as ShoppingBasketIcon,
    AddBox as AddBoxIcon, KeyboardArrowRight as ArrowRightIcon,
    KeyboardArrowDown as ArrowDownIcon, DarkMode as DarkModeIcon,
    LightMode as LightModeIcon
} from '@mui/icons-material';

const API = 'http://localhost:9000/api';

// Создаем современную тему
const modernTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: [
            '"Inter"',
            'sans-serif'
        ].join(','),
        h4: {
            fontWeight: 700,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '8px 16px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    marginBottom: 4,
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.03)',
                    },
                },
            },
        },
    },
});

const ProductsPage = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [autoCalculate, setAutoCalculate] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryTree, setCategoryTree] = useState([]);

    // Применяем тему с сохранением в localStorage
    const appliedTheme = useMemo(() => {
        return createTheme({
            ...modernTheme,
            palette: {
                ...modernTheme.palette,
                mode: darkMode ? 'dark' : 'light',
            },
        });
    }, [darkMode]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Функция для построения дерева категорий
    const buildCategoryTree = useCallback((categories, parentId = null) => {
        return categories
            .filter(category => {
                const catParent = category.parent ? category.parent.toString() : null;
                return catParent === (parentId ? parentId.toString() : null);
            })
            .map(category => ({
                ...category,
                children: buildCategoryTree(categories, category._id),
                hasChildren: categories.some(cat =>
                    cat.parent?.toString() === category._id.toString()
                )
            }));
    }, []);

    // Обновление дерева категорий при изменении данных
    useEffect(() => {
        if (categories.length > 0) {
            const tree = buildCategoryTree(categories);
            setCategoryTree(tree);

            // Инициализация открытых категорий
            const initialExpanded = {};
            tree.forEach(cat => {
                initialExpanded[cat._id] = false;
            });
            setExpandedCategories(initialExpanded);
        }
    }, [categories, buildCategoryTree]);

    const fetchProducts = async () => {
        try {
            console.log("Fetching products...");
            const response = await axios.get(`${API}/products`);
            setProducts(response.data);
            console.log("Products fetched successfully");
        } catch (error) {
            console.error('Error fetching products:', error.response?.data || error.message);
        }
    };

    const fetchCategories = async () => {
        try {
            console.log("Fetching categories...");
            const response = await axios.get(`${API}/categories`);
            setCategories(response.data);
            console.log("Categories fetched successfully");
        } catch (error) {
            console.error('Error fetching categories:', error.response?.data || error.message);
        }
    };

    const handleSubmit = async () => {
        try {
            console.log("Saving product...", currentProduct);
            if (currentProduct._id) {
                await axios.patch(`${API}/products/${currentProduct._id}`, currentProduct);
            } else {
                await axios.post(`${API}/products`, currentProduct);
            }
            fetchProducts();
            setOpenDialog(false);
            console.log("Product saved successfully");
        } catch (error) {
            console.error('Error saving product:', error.response?.data || error.message);
        }
    };

    const handleCategorySubmit = async () => {
        try {
            console.log("Saving category...", currentCategory);
            if (currentCategory._id) {
                await axios.patch(`${API}/categories/${currentCategory._id}`, currentCategory);
            } else {
                await axios.post(`${API}/categories`, currentCategory);
            }
            fetchCategories();
            setOpenCategoryDialog(false);
            console.log("Category saved successfully");
        } catch (error) {
            console.error('Error saving category:', error.response?.data || error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log("Deleting product...", id);
            await axios.delete(`${API}/products/${id}`);
            fetchProducts();
            console.log("Product deleted successfully");
        } catch (error) {
            console.error('Error deleting product:', error.response?.data || error.message);
        }
    };

    const handleCategoryDelete = async (id) => {
        try {
            console.log("Deleting category...", id);
            await axios.delete(`${API}/categories/${id}`);
            fetchCategories();
            console.log("Category deleted successfully");
        } catch (error) {
            console.error('Error deleting category:', error.response?.data || error.message);
        }
    };

    const handlePurchasePriceChange = (e) => {
        const purchasePrice = parseFloat(e.target.value) || 0;
        setCurrentProduct(prev => {
            const newProduct = { ...prev, purchasePrice };

            if (autoCalculate && purchasePrice > 0) {
                const price = purchasePrice * (1 + (prev.markupPercentage || 0) / 100);
                newProduct.price = Math.round(price * 100) / 100;
            }

            return newProduct;
        });
    };

    const handleMarkupChange = (e) => {
        const markupPercentage = parseFloat(e.target.value) || 0;
        setCurrentProduct(prev => {
            const newProduct = { ...prev, markupPercentage };

            if (autoCalculate && prev.purchasePrice > 0) {
                const price = prev.purchasePrice * (1 + markupPercentage / 100);
                newProduct.price = Math.round(price * 100) / 100;
            }

            return newProduct;
        });
    };

    const toggleCategory = (categoryId) => {
        console.log("Toggling category:", categoryId);
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const handleCategoryClick = (categoryId, hasChildren) => {
        console.log("Category clicked:", categoryId);
        if (hasChildren) {
            toggleCategory(categoryId);
        }
        setSelectedCategory(categoryId);
    };

    const toggleDarkMode = () => {
        console.log("Toggling dark mode");
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    // Рекурсивная функция для отображения дерева категорий
    const renderCategoryNode = (category, level = 0) => {
        const isExpanded = expandedCategories[category._id];
        const isSelected = selectedCategory === category._id;
        const productsInCategory = products.filter(
            p => p.category?.toString() === category._id.toString()
        );

        return (
            <div key={category._id}>
                <Paper
                    elevation={isSelected ? 3 : 0}
                    sx={{
                        mb: 1,
                        ml: `${level * 2}rem`,
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: isSelected ? appliedTheme.palette.action.selected : 'transparent',
                        border: isSelected ? `1px solid ${appliedTheme.palette.primary.main}` : '1px solid transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: appliedTheme.palette.action.hover,
                        }
                    }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{ cursor: 'pointer', py: 1, px: 1 }}
                        onClick={() => handleCategoryClick(category._id, category.hasChildren)}
                    >
                        {category.hasChildren ? (
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCategory(category._id);
                                }}
                            >
                                {isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
                            </IconButton>
                        ) : (
                            <Box width={40} />
                        )}

                        {isExpanded ? (
                            <FolderOpenIcon sx={{ color: appliedTheme.palette.warning.main, mx: 1 }} />
                        ) : (
                            <FolderIcon sx={{ color: appliedTheme.palette.warning.main, mx: 1 }} />
                        )}

                        <Typography
                            variant="subtitle1"
                            sx={{
                                flexGrow: 1,
                                fontWeight: isSelected ? 600 : 500,
                                color: isSelected ? appliedTheme.palette.primary.main : 'inherit'
                            }}
                        >
                            {category.name}
                        </Typography>

                        <Chip
                            label={`${productsInCategory.length} товаров`}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                        />

                        <Tooltip title="Добавить подкатегорию">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentCategory({
                                        name: '',
                                        parent: category._id,
                                        description: ''
                                    });
                                    setOpenCategoryDialog(true);
                                }}
                            >
                                <AddBoxIcon fontSize="small" color="success" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Редактировать">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentCategory(category);
                                    setOpenCategoryDialog(true);
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Удалить">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCategoryDelete(category._id);
                                }}
                            >
                                <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box ml={4} mt={1}>
                            {category.children.map(child =>
                                renderCategoryNode(child, level + 1)
                            )}
                        </Box>
                    </Collapse>

                    {(isExpanded || (!category.hasChildren && isSelected)) && (
                        <Box ml={4} mt={1}>
                            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Товары в категории
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={() => {
                                            setCurrentProduct({
                                                name: '',
                                                price: 0,
                                                purchasePrice: 0,
                                                markupPercentage: 0,
                                                category: category._id,
                                                description: '',
                                                quantity: 0
                                            });
                                            setOpenDialog(true);
                                        }}
                                    >
                                        Добавить товар
                                    </Button>
                                </Box>

                                {products.filter(p => p.category?.toString() === category._id.toString()).length > 0 ? (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Товар</TableCell>
                                                    <TableCell align="right">Закупочная</TableCell>
                                                    <TableCell align="right">Наценка</TableCell>
                                                    <TableCell align="right">Цена</TableCell>
                                                    <TableCell align="right">Кол-во</TableCell>
                                                    <TableCell>Действия</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {products
                                                    .filter(p => p.category?.toString() === category._id.toString())
                                                    .map(product => (
                                                        <TableRow
                                                            key={product._id}
                                                            hover
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell>{product.name}</TableCell>
                                                            <TableCell align="right">{product.purchasePrice?.toFixed(2) || '0.00'} ₽</TableCell>
                                                            <TableCell align="right">{product.markupPercentage || 0}%</TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                                {product.price?.toFixed(2) || '0.00'} ₽
                                                            </TableCell>
                                                            <TableCell align="right">{product.quantity}</TableCell>
                                                            <TableCell>
                                                                <Tooltip title="Редактировать">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => {
                                                                            setCurrentProduct(product);
                                                                            setOpenDialog(true);
                                                                        }}
                                                                    >
                                                                        <EditIcon fontSize="small" color="primary" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Удалить">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => {
                                                                            handleDelete(product._id);
                                                                        }}
                                                                    >
                                                                        <DeleteIcon fontSize="small" color="error" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        py={4}
                                        sx={{ opacity: 0.7 }}
                                    >
                                        <ShoppingBasketIcon fontSize="large" color="disabled" />
                                        <Typography variant="body2" color="textSecondary" mt={1}>
                                            Нет товаров в этой категории
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    )}
                </Paper>
            </div>
        );
    };

    return (
        <ThemeProvider theme={appliedTheme}>
            <CssBaseline />
            <Container maxWidth="lg" className="products-page" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box display="flex" alignItems="center">
                        <CategoryIcon sx={{ fontSize: 40, mr: 2, color: appliedTheme.palette.primary.main }} />
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Управление товарами
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setCurrentProduct({
                                    name: '',
                                    price: 0,
                                    purchasePrice: 0,
                                    markupPercentage: 0,
                                    category: null,
                                    description: '',
                                    quantity: 0
                                });
                                setOpenDialog(true);
                            }}
                            sx={{ mr: 2 }}
                        >
                            Добавить товар
                        </Button>

                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<AddBoxIcon />}
                            onClick={() => {
                                setCurrentCategory({ name: '', parent: null, description: '' });
                                setOpenCategoryDialog(true);
                            }}
                            sx={{ mr: 2 }}
                        >
                            Добавить категорию
                        </Button>

                        <Tooltip title={darkMode ? "Светлая тема" : "Темная тема"}>
                            <IconButton
                                onClick={toggleDarkMode}
                                color="inherit"
                                aria-label="toggle-dark-mode"
                            >
                                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Дерево категорий
                        </Typography>
                        <Chip
                            label={`${categories.length} категорий, ${products.length} товаров`}
                            color="primary"
                            variant="outlined"
                        />
                    </Box>

                    <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
                        {categoryTree.map(category => renderCategoryNode(category))}
                    </Box>
                </Paper>

                {/* Диалог товара */}
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    fullWidth
                    maxWidth="md"
                    PaperProps={{ sx: { borderRadius: 3 } }}
                >
                    <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                        <ShoppingBasketIcon sx={{ mr: 1 }} />
                        {currentProduct?._id ? 'Редактирование товара' : 'Новый товар'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Наименование"
                            fullWidth
                            margin="normal"
                            value={currentProduct?.name || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        <Box display="flex" gap={2} mt={2}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Категория</InputLabel>
                                <Select
                                    value={currentProduct?.category || ''}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                    label="Категория"
                                >
                                    <MenuItem value="">Без категории</MenuItem>
                                    {categories.map(cat => (
                                        <MenuItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Typography variant="subtitle2" color="textSecondary" mb={1}>
                            Ценообразование
                        </Typography>

                        <Box display="flex" gap={2} mb={3}>
                            <TextField
                                label="Закупочная цена"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={currentProduct?.purchasePrice || 0}
                                onChange={handlePurchasePriceChange}
                                inputProps={{ min: 0, step: 0.01 }}
                            />

                            <TextField
                                label="Наценка, %"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={currentProduct?.markupPercentage || 0}
                                onChange={handleMarkupChange}
                                inputProps={{ min: 0, step: 0.1 }}
                            />

                            <TextField
                                label="Цена продажи"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={currentProduct?.price || 0}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) || 0 })}
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </Box>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={autoCalculate}
                                    onChange={(e) => setAutoCalculate(e.target.checked)}
                                />
                            }
                            label="Автоматически рассчитывать цену"
                            sx={{ mt: 1, mb: 2 }}
                        />

                        <Box display="flex" gap={2} mb={3}>
                            <TextField
                                label="Количество"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={currentProduct?.quantity || 0}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: parseInt(e.target.value) || 0 })}
                                inputProps={{ min: 0 }}
                            />
                        </Box>

                        <TextField
                            label="Описание"
                            fullWidth
                            margin="normal"
                            multiline
                            minRows={3}
                            value={currentProduct?.description || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            onClick={() => setOpenDialog(false)}
                            variant="outlined"
                            sx={{ mr: 2 }}
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{ minWidth: 120 }}
                        >
                            Сохранить
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Диалог категории */}
                <Dialog
                    open={openCategoryDialog}
                    onClose={() => setOpenCategoryDialog(false)}
                    PaperProps={{ sx: { borderRadius: 3 } }}
                >
                    <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                        <FolderIcon sx={{ mr: 1 }} />
                        {currentCategory?._id ? 'Редактирование категории' : 'Новая категория'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Название категории"
                            fullWidth
                            margin="normal"
                            value={currentCategory?.name || ''}
                            onChange={(e) => setCurrentCategory({
                                ...currentCategory,
                                name: e.target.value
                            })}
                            sx={{ mb: 2 }}
                            required
                            error={!currentCategory?.name?.trim()}
                            helperText={!currentCategory?.name?.trim() ? "Название обязательно" : ""}
                        />

                        {currentCategory?.parent && (
                            <Typography variant="body2" color="textSecondary" mb={1}>
                                Родительская категория: {
                                    categories.find(c => c._id === currentCategory.parent)?.name || 'Неизвестно'
                                }
                            </Typography>
                        )}

                        <TextField
                            label="Описание"
                            fullWidth
                            margin="normal"
                            multiline
                            minRows={3}
                            value={currentCategory?.description || ''}
                            onChange={(e) => setCurrentCategory({
                                ...currentCategory,
                                description: e.target.value
                            })}
                            sx={{ mt: 2 }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            onClick={() => setOpenCategoryDialog(false)}
                            variant="outlined"
                            sx={{ mr: 2 }}
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={handleCategorySubmit}
                            variant="contained"
                            sx={{ minWidth: 120 }}
                            disabled={!currentCategory?.name?.trim()}
                        >
                            Сохранить
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};

export default ProductsPage;