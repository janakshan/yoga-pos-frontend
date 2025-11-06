import toast from 'react-hot-toast';

/**
 * Notification Service
 * Handles Email, SMS, and WhatsApp notifications
 */

class NotificationService {
  constructor() {
    this.providers = {
      email: new EmailProvider(),
      sms: new SMSProvider(),
      whatsapp: new WhatsAppProvider(),
    };

    // Queue for managing notifications
    this.notificationQueue = [];
    this.isProcessing = false;
  }

  /**
   * Send notification through specified channel
   */
  async send(channel, payload) {
    try {
      const provider = this.providers[channel];
      if (!provider) {
        throw new Error(`Notification channel '${channel}' not supported`);
      }

      const result = await provider.send(payload);

      // Show success toast
      toast.success(`${channel.toUpperCase()} notification sent successfully`);

      return {
        success: true,
        channel,
        messageId: result.messageId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Failed to send ${channel} notification:`, error);
      toast.error(`Failed to send ${channel} notification: ${error.message}`);

      return {
        success: false,
        channel,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Send notification to multiple channels
   */
  async sendMulti(channels, payload) {
    const results = await Promise.allSettled(
      channels.map(channel => this.send(channel, payload))
    );

    return results.map((result, index) => ({
      channel: channels[index],
      success: result.status === 'fulfilled',
      data: result.value || result.reason,
    }));
  }

  /**
   * Queue notification for later sending
   */
  queueNotification(notification) {
    this.notificationQueue.push({
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'queued',
      createdAt: new Date().toISOString(),
    });

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Process notification queue
   */
  async processQueue() {
    if (this.notificationQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const notification = this.notificationQueue.shift();

    try {
      notification.status = 'processing';
      const result = await this.send(notification.channel, notification.payload);
      notification.status = result.success ? 'sent' : 'failed';
      notification.result = result;
    } catch (error) {
      notification.status = 'failed';
      notification.error = error.message;
    }

    // Continue processing queue
    setTimeout(() => this.processQueue(), 1000);
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      queueLength: this.notificationQueue.length,
      isProcessing: this.isProcessing,
      notifications: [...this.notificationQueue],
    };
  }

  /**
   * Send notification for specific events
   */
  async notifyEvent(eventType, data) {
    const templates = {
      sale: {
        email: {
          subject: 'Purchase Receipt',
          body: `Thank you for your purchase! Total: ${data.total}`,
        },
        sms: {
          message: `Thank you for your purchase at ${data.businessName}. Total: ${data.total}. Receipt: ${data.receiptUrl}`,
        },
        whatsapp: {
          message: `🙏 Thank you for your purchase!\n\nTotal: ${data.total}\nDate: ${data.date}\n\nView receipt: ${data.receiptUrl}`,
        },
      },
      booking: {
        email: {
          subject: 'Class Booking Confirmation',
          body: `Your class "${data.className}" has been booked for ${data.date}`,
        },
        sms: {
          message: `Class booking confirmed: ${data.className} on ${data.date}. See you there!`,
        },
        whatsapp: {
          message: `✅ Booking Confirmed\n\nClass: ${data.className}\nDate: ${data.date}\nTime: ${data.time}\n\nSee you there! 🧘`,
        },
      },
      lowStock: {
        email: {
          subject: 'Low Stock Alert',
          body: `Product "${data.productName}" is running low (${data.quantity} remaining)`,
        },
        sms: {
          message: `Low stock alert: ${data.productName} - ${data.quantity} remaining`,
        },
        whatsapp: {
          message: `⚠️ Low Stock Alert\n\nProduct: ${data.productName}\nRemaining: ${data.quantity}\nReorder level: ${data.reorderLevel}`,
        },
      },
      payment: {
        email: {
          subject: 'Payment Reminder',
          body: `Your payment of ${data.amount} is due on ${data.dueDate}`,
        },
        sms: {
          message: `Payment reminder: ${data.amount} due on ${data.dueDate}`,
        },
        whatsapp: {
          message: `💰 Payment Reminder\n\nAmount: ${data.amount}\nDue Date: ${data.dueDate}\n\nPay now to avoid late fees.`,
        },
      },
      membership: {
        email: {
          subject: 'Membership Expiry Notice',
          body: `Your membership expires on ${data.expiryDate}. Renew now to continue enjoying our services.`,
        },
        sms: {
          message: `Your membership expires on ${data.expiryDate}. Renew now!`,
        },
        whatsapp: {
          message: `⏰ Membership Expiring Soon\n\nExpiry Date: ${data.expiryDate}\n\nRenew now to continue enjoying all benefits! 🎯`,
        },
      },
    };

    const template = templates[eventType];
    if (!template) {
      console.warn(`No template found for event type: ${eventType}`);
      return;
    }

    // Determine which channels to use based on user preferences
    const channels = data.channels || ['email'];

    const results = [];
    for (const channel of channels) {
      if (template[channel]) {
        const payload = {
          to: data.recipient,
          ...template[channel],
          ...data.additionalData,
        };

        const result = await this.send(channel, payload);
        results.push(result);
      }
    }

    return results;
  }
}

/**
 * Email Notification Provider
 */
class EmailProvider {
  constructor() {
    // In production, configure with actual email service (SendGrid, AWS SES, etc.)
    this.config = {
      apiKey: import.meta.env.VITE_EMAIL_API_KEY || 'demo-key',
      from: import.meta.env.VITE_EMAIL_FROM || 'noreply@yogapos.com',
      serviceUrl: import.meta.env.VITE_EMAIL_SERVICE_URL || 'https://api.emailservice.com/send',
    };
  }

  async send(payload) {
    const { to, subject, body, html, attachments } = payload;

    // Validate email
    if (!this.validateEmail(to)) {
      throw new Error('Invalid email address');
    }

    // In production, make actual API call to email service
    // For demo purposes, simulate API call
    await this.simulateDelay(1000);

    // Mock successful response
    return {
      messageId: `email-${Date.now()}`,
      provider: 'email',
      status: 'sent',
      timestamp: new Date().toISOString(),
    };

    // Production implementation example:
    /*
    try {
      const response = await fetch(this.config.serviceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          from: this.config.from,
          to,
          subject,
          text: body,
          html: html || body,
          attachments,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
    */
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * SMS Notification Provider
 */
class SMSProvider {
  constructor() {
    // In production, configure with actual SMS service (Twilio, AWS SNS, etc.)
    this.config = {
      apiKey: import.meta.env.VITE_SMS_API_KEY || 'demo-key',
      from: import.meta.env.VITE_SMS_FROM || '+1234567890',
      serviceUrl: import.meta.env.VITE_SMS_SERVICE_URL || 'https://api.smsservice.com/send',
    };
  }

  async send(payload) {
    const { to, message } = payload;

    // Validate phone number
    if (!this.validatePhone(to)) {
      throw new Error('Invalid phone number');
    }

    // In production, make actual API call to SMS service
    await this.simulateDelay(1500);

    return {
      messageId: `sms-${Date.now()}`,
      provider: 'sms',
      status: 'sent',
      timestamp: new Date().toISOString(),
    };

    // Production implementation example:
    /*
    try {
      const response = await fetch(this.config.serviceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          from: this.config.from,
          to,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error(`SMS service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
    */
  }

  validatePhone(phone) {
    // Basic phone validation (adjust based on your requirements)
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * WhatsApp Notification Provider
 */
class WhatsAppProvider {
  constructor() {
    // In production, configure with WhatsApp Business API
    this.config = {
      apiKey: import.meta.env.VITE_WHATSAPP_API_KEY || 'demo-key',
      phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_ID || '1234567890',
      serviceUrl: import.meta.env.VITE_WHATSAPP_SERVICE_URL || 'https://graph.facebook.com/v17.0',
    };
  }

  async send(payload) {
    const { to, message, templateName, templateParams } = payload;

    // Validate phone number
    if (!this.validatePhone(to)) {
      throw new Error('Invalid phone number for WhatsApp');
    }

    // In production, make actual API call to WhatsApp Business API
    await this.simulateDelay(2000);

    return {
      messageId: `whatsapp-${Date.now()}`,
      provider: 'whatsapp',
      status: 'sent',
      timestamp: new Date().toISOString(),
    };

    // Production implementation example:
    /*
    try {
      const url = `${this.config.serviceUrl}/${this.config.phoneNumberId}/messages`;

      const body = templateName ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en_US' },
          components: templateParams ? [
            {
              type: 'body',
              parameters: templateParams,
            },
          ] : [],
        },
      } : {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
    */
  }

  validatePhone(phone) {
    // WhatsApp requires phone number in E.164 format
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
