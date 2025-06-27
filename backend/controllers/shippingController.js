
const Shipping = require("../models/shippingModel")

const createShipping = async (req, res) => {
    // const { userId } = req.params;
    // console.log("beep")
    // console.log(req.params)  
    // const { productId, cartId } = req.body;
    const { name, phoneNumber, address, streetNumber, area, city, district, province, country, postalCode, userId } = req.body;
    console.log(req.body)
    try {
        if(!name || !phoneNumber || !address || !streetNumber || !area || !city || !district || !province || !country || !postalCode ) {
            return res.status(401).json({message: "Please enter all the fields"})
        }
        
        const shipping = new Shipping({
            user: userId, name, phoneNumber, address, streetNumber, area, city, district, province, country, postalCode
        })
        await shipping.save()
        return res.status(201).json({message: "Shipping info filled", shipping})
    } catch (error) {
        console.log(error.message)
    }
}   

const updateShipping = async (req, res) => {
    const { name, phoneNumber, address, streetNumber, area, city, district, province, country, postalCode, userId } = req.body;
    
    try {
        // Check for required fields
        if (!name || !phoneNumber || !address || !streetNumber || !area || !city || !district || !province || !country || !postalCode) {
            return res.status(400).json({ message: "Please enter all the fields" });
        }

        // Find the existing shipping information
        const shipping = await Shipping.findOne({ user: userId });

        if (!shipping) {
            return res.status(404).json({ message: "Shipping info not found" });
        }

        // Update the shipping information
        shipping.name = name;
        shipping.phoneNumber = phoneNumber;
        shipping.address = address;
        shipping.streetNumber = streetNumber;
        shipping.area = area;
        shipping.city = city;
        shipping.district = district;
        shipping.province = province;
        shipping.country = country;
        shipping.postalCode = postalCode;

        await shipping.save();  // Save the updated document

        return res.status(200).json({ message: "Shipping info updated", shipping });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const getShippingInfo = async (req, res) => {
    // const { userId } = req.params.id;
    const { id: userId } = req.params;
    try {
        const shipping = await Shipping.findOne({ user: userId })
        if(!shipping) {
            return res.status(404).json({message: "Shipping info not found"})
        }
        if(shipping) {
            return res.status(200).json({message: "Shipping info found", shipping})
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createShipping,
    getShippingInfo,
    updateShipping
}