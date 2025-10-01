import axios from "axios"
import fs from 'fs'
import FormData from 'form-data'
import userModel from "../models/userModel.js"

// Controller function to ramove bg from image

const removeBgImage = async (req, res) => {
    try {
        const { clerkId } = req.body

        const user = await userModel.findOne({ clerkId })

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.creditBalance === 0) {
            return res.json({ success: false, message: 'Not enough credit balance', creditBalance: user.creditBalance })
        }

        const imagePath = req.file.path;

        // reading the image file
        const imageFile = fs.createReadStream(imagePath)

        const formdata = new FormData()
        formdata.append('image_file', imageFile)

        const { data } = await axios.post('https://api.remove.bg/v1.0/removebg', formdata, {
            headers: {
                'X-Api-Key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer'
        })

        const base64Image = Buffer.from(data, 'binary').toString("base64")

        const resultImage = `data:${req.file.mimetype};base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

        res.json({ success: true, resultImage, creditBalance: user.creditBalance - 1, message: 'Background removed' })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export { removeBgImage }