const Category = require("../models/category");


//create category
exports.createCategory = async (req, res) =>{
    try{
        const {category} = req.body;

        if(!category){
            return res.status(401).json({
                success: false,
                message:"Enter the name of the category"
            })
        }

        const response = await Category.create({category: category, events:[]});

        res.status(200).json({
            success: true,
            message: "Category created"
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Some internal error occured in creating category"
        })
    }
}



// get all categories
exports.getAllCategories = async (req, res) =>{
    try{
       const categories = await Category.find();
       const categoryName = categories.map((cat) => cat.category);//map return array
        
       res.status(200).json({
         success: true,
         message: "All categories fetched",
         response: categoryName
        });


        res.status(200).json({
            success: true,
            message:"all categories fetched",
            response 
        })
    } catch(err){
        res.status(500).json({
            success: false,
            message:""
        })
    }
}