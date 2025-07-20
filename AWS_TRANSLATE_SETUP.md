# AWS Translate Setup Guide

This guide will help you set up AWS Translate for real-time translation in your application.

## 🚀 Quick Start

### 1. AWS Account Setup

1. **Create AWS Account**
   - Go to [https://aws.amazon.com/](https://aws.amazon.com/)
   - Sign up for an AWS account
   - Complete the registration process

2. **Create IAM User**
   - Go to AWS IAM Console
   - Create a new user for your application
   - Attach the `TranslateFullAccess` policy
   - Generate Access Key ID and Secret Access Key

3. **Enable AWS Translate**
   - Go to AWS Translate Console
   - Click "Get started with Amazon Translate"
   - Select your preferred region

### 2. Configure Environment Variables

Since you're already using AWS S3, you can use the same AWS credentials for AWS Translate. Add these environment variables to your `.env` file:

```env
# AWS Translate Configuration (uses same credentials as S3)
USE_AWS_TRANSLATE=true
# Uses existing S3 environment variables:
# S3_REGION=us-east-1
# S3_ACCESS_KEY_ID=your_access_key_id
# S3_SECRET_ACCESS_KEY=your_secret_access_key
```

**Note:** If you already have S3 configured, you can reuse the same AWS credentials. Just make sure to add `USE_AWS_TRANSLATE=true` to enable AWS Translate.

### 3. Test the Integration

1. Start your development server
2. Go to `/agent/tours/add` or `/agent/tours/edit/[id]`
3. Type Chinese text in any field and click the translate button next to it
4. The translation will be applied to the field automatically

## 🔧 Detailed Setup

### IAM User Creation

1. **Go to IAM Console**
   - Navigate to [IAM Console](https://console.aws.amazon.com/iam/)
   - Click "Users" → "Create user"

2. **Set User Details**
   - Username: `translate-app-user`
   - Access type: "Programmatic access"

3. **Attach Permissions**
   - Click "Attach existing policies directly"
   - Search for "TranslateFullAccess"
   - Select and attach the policy

4. **Create Access Keys**
   - After user creation, go to "Security credentials"
   - Create access key
   - Download the CSV file with credentials

### AWS Region Selection

Choose the region closest to your users:

- **US East (N. Virginia)**: `us-east-1`
- **US West (Oregon)**: `us-west-2`
- **Europe (Ireland)**: `eu-west-1`
- **Asia Pacific (Tokyo)**: `ap-northeast-1`
- **Asia Pacific (Singapore)**: `ap-southeast-1`

### Security Best Practices

1. **Restrict IAM Permissions**

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["translate:TranslateText"],
         "Resource": "*"
       }
     ]
   }
   ```

2. **Use IAM Roles** (for production)
   - Create IAM role instead of user
   - Attach to your application server

3. **Environment Variables**
   - Never commit credentials to version control
   - Use AWS Secrets Manager for production

## 💰 Pricing

AWS Translate pricing (as of 2024):

- **Standard Translation**: $15 per million characters
- **Custom Translation**: $60 per million characters
- **Free Tier**: 2 million characters per month for first 12 months

### Cost Optimization

1. **Monitor Usage**
   - Set up CloudWatch alarms
   - Monitor translation requests

2. **Caching Strategy**
   - Cache frequent translations
   - Use database storage for repeated phrases

3. **Batch Processing**
   - Group multiple translations
   - Reduce API calls

## 🎯 AWS Translate Features

| Feature           | AWS Translate    |
| ----------------- | ---------------- |
| **Pricing**       | $15/M characters |
| **Accuracy**      | High             |
| **Languages**     | 75+              |
| **Custom Models** | ✅               |
| **Real-time**     | ✅               |
| **Setup**         | Medium           |
| **Integration**   | Direct AWS API   |

## 📝 Usage Examples

### Environment Configuration

```env
# Production - uses existing S3 credentials
USE_AWS_TRANSLATE=true
# Uses existing S3 environment variables:
# S3_REGION=us-east-1
# S3_ACCESS_KEY_ID=AKIA...
# S3_SECRET_ACCESS_KEY=...

# Development (fallback to mock)
USE_AWS_TRANSLATE=false
```

### Form Integration

Translation is integrated into the tour forms:

```typescript
// In add/edit tour forms:
// - Title field with translate button
// - Destination field with translate button
// - Description fields with translate buttons
// - Itinerary day titles and descriptions
// - Inclusions and exclusions lists
// - All Chinese text is automatically detected and translated
```

### Translation Service

The system now uses only AWS Translate:

```typescript
// Only AWS Translate is supported
// Requires: USE_AWS_TRANSLATE=true and AWS credentials
// Falls back to original text if AWS Translate is not configured
```

## 🔍 API Response Format

AWS Translate returns:

```json
{
  "TranslatedText": "Hello world",
  "SourceLanguageCode": "zh",
  "TargetLanguageCode": "en",
  "AppliedTerminologies": []
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Access Denied"**
   - Check IAM permissions
   - Verify access keys
   - Ensure Translate service is enabled

2. **"Invalid credentials"**
   - Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
   - Check region configuration
   - Ensure credentials are active

3. **"Service unavailable"**
   - Check AWS service status
   - Verify region availability
   - Check account limits

### Debug Mode

Enable detailed logging:

```env
DEBUG=aws:*
```

### Testing Without AWS

For development, the system falls back to:

1. **Google Translate** (if configured)
2. **LibreTranslate** (if configured)
3. **Mock translations** (predefined mappings)

## 📊 Monitoring & Analytics

### AWS CloudWatch

- **Metrics**: Translation requests, errors, latency
- **Logs**: API calls and responses
- **Alarms**: Set up cost and error alerts

### Application Monitoring

```typescript
// Monitor translation success rates
console.log("Translation success:", successRate);
console.log("Average response time:", avgResponseTime);
console.log("Monthly usage:", monthlyUsage);
```

## 💡 Best Practices

### Performance

- **Use appropriate regions** for lower latency
- **Implement caching** for repeated translations
- **Batch requests** when possible
- **Monitor response times**

### Cost Management

- **Set up billing alerts**
- **Monitor usage regularly**
- **Use free tier** for development
- **Implement smart caching**

### Security

- **Use IAM roles** instead of access keys in production
- **Restrict permissions** to minimum required
- **Rotate credentials** regularly
- **Monitor access logs**

## 🎨 Customization

### Language Support

AWS Translate supports 75+ languages. Common codes:

```typescript
const supportedLanguages = {
  en: "English",
  de: "German",
  ja: "Japanese",
  es: "Spanish",
  th: "Thai",
  zh: "Chinese",
  ko: "Korean",
  fr: "French",
  it: "Italian",
  pt: "Portuguese",
};
```

### Custom Terminology

For domain-specific translations:

```typescript
// Create custom terminology in AWS Console
// Upload CSV with source/target pairs
// Reference in translation requests
```

## 🚀 Production Deployment

1. **Set up production environment variables**
2. **Configure IAM roles** (not access keys)
3. **Set up monitoring and alerts**
4. **Test with real Chinese content**
5. **Monitor costs and usage**
6. **Implement proper error handling**

## 🔄 Migration from Google Translate

### Step-by-Step Migration

1. **Set up AWS account and credentials**
2. **Update environment variables**
3. **Test with small batch of translations**
4. **Compare quality and performance**
5. **Gradually switch over**
6. **Monitor costs and accuracy**

### Environment Variable Changes

```env
# Before (Google)
TRANSLATION_API_KEY=google_api_key

# After (AWS) - uses existing S3 credentials
USE_AWS_TRANSLATE=true
# Uses existing S3 environment variables:
# S3_REGION=us-east-1
# S3_ACCESS_KEY_ID=your_key
# S3_SECRET_ACCESS_KEY=your_secret
```

## 📞 Support

### AWS Support

- **Documentation**: [AWS Translate Docs](https://docs.aws.amazon.com/translate/)
- **Console**: [AWS Translate Console](https://console.aws.amazon.com/translate/)
- **Support**: AWS Support plans available

### Application Support

If you encounter issues:

1. Check AWS CloudWatch logs
2. Verify IAM permissions
3. Test with the demo page at `/agent/real-time-translate`
4. Verify environment variables are set correctly

## 🎯 Next Steps

1. **Set up AWS account** and create IAM user
2. **Configure environment variables** with your credentials
3. **Test the integration** with sample Chinese text
4. **Monitor usage** and set up alerts
5. **Optimize for your use case** (caching, batching, etc.)

---

**Happy translating with AWS! 🚀**
