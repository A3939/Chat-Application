import Message from "../models/message.model";
import User from "../models/user.model";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    if (!loggedInUserId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password -__v");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("🚀 ~ getUsersForSidebar ~ error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("🚀 ~ getMessages ~ error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const myId = req.user._id;
    const { id: receiverId } = req.params;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: myId,
      receiverId,
      text,
      image: imageUrl || null,
    });

    const savedMessage = await newMessage.save();

    //TODO: realtime message functionality build here
    res.status(201).json(savedMessage);
  } catch (error) {
    console.log("🚀 ~ sendMessage ~ error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
