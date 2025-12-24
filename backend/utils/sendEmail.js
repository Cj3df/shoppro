const nodemailer = require('nodemailer');

/**
 * Create email transporter
 * Uses Gmail by default, can be configured for other providers
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

/**
 * Send email using nodemailer
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body (optional)
 * @returns {Promise<object>} Nodemailer send result
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `ShopMaster Pro <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: html || text,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent:', result.messageId);
        return result;
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};

/**
 * Send order confirmation email
 * @param {object} order - Order details
 * @param {object} customer - Customer details
 */
const sendOrderConfirmation = async (order, customer) => {
    const subject = `Order Confirmation - ${order.orderNumber}`;
    const text = `
    Dear ${customer.name},

    Thank you for your order!

    Order Number: ${order.orderNumber}
    Total Amount: ₹${order.totalAmount}
    Status: ${order.status}

    We will notify you once your order is shipped.

    Thank you for shopping with ShopMaster Pro!
  `;

    return sendEmail({
        to: customer.email,
        subject,
        text,
    });
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} resetUrl - Password reset URL
 */
const sendPasswordResetEmail = async (email, resetUrl) => {
    const subject = 'Password Reset Request - ShopMaster Pro';
    const text = `
    You requested a password reset.

    Please click the following link to reset your password:
    ${resetUrl}

    This link will expire in 1 hour.

    If you did not request this, please ignore this email.
  `;

    return sendEmail({
        to: email,
        subject,
        text,
    });
};

module.exports = {
    sendEmail,
    sendOrderConfirmation,
    sendPasswordResetEmail,
};
