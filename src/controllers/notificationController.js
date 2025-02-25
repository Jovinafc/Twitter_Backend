const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
          userId: req.user.id,
        }).sort({ timestamp: -1 });
    
        res.json({status: 'success', data: notifications});
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      }
}

exports.markAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findById(notificationId);
    
        if (!notification) {
          return res.status(404).json({ status: 'failed', message: 'Notification not found' });
        }
    
        notification.read = true;
        await notification.save();
    
        res.json({ status: 'success', message: 'Notification marked as read' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      }
}