# Amazon Bedrock Setup Guide

## Overview

This application has been migrated from Google Gemini to Amazon Bedrock for menu extraction functionality. Bedrock provides better PDF support, higher accuracy, and enterprise-grade reliability.

## Prerequisites

1. **AWS Account** with Bedrock access
2. **IAM User** with appropriate permissions
3. **Model Access** to Claude 3.5 Sonnet in Bedrock

## Step 1: AWS Account Setup

### Create IAM User

1. Go to AWS IAM Console
2. Create a new user for the application
3. Attach the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["bedrock:InvokeModel"],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0"
      ]
    }
  ]
}
```

### Get Access Keys

1. Go to the user's "Security credentials" tab
2. Create access key for "Application running outside AWS"
3. Save the Access Key ID and Secret Access Key

## Step 2: Enable Model Access

1. Go to **AWS Bedrock Console**
2. Navigate to **"Model access"** in the left sidebar
3. Click **"Request model access"**
4. Find **"Claude 3.5 Sonnet"** and request access
5. Wait for approval (usually instant for most accounts)

## Step 3: Environment Configuration

Add these variables to your `.env.local` file:

```env
# AWS Bedrock Configuration (for menu extraction)
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
AWS_REGION=us-east-1
```

**Important Notes:**

- Keep these credentials secure and never commit them to version control
- Use `us-east-1` region as it has the best model availability
- You can use other regions, but verify Claude 3.5 Sonnet is available

## Step 4: Testing the Setup

### Test API Endpoint

1. Start your development server: `npm run dev`
2. Use a tool like Postman or curl to test the endpoint:

```bash
curl -X POST http://localhost:3000/client/api/v1/extract-menu-data \
  -F "file=@path/to/your/menu.jpg"
```

### Expected Response

```json
{
  "success": true,
  "data": [
    {
      "name": "Menu Item Name",
      "price": "12.99",
      "description": "Item description"
    }
  ]
}
```

## Supported File Types

- **Images**: PNG, JPEG, JPG (up to 20MB)
- **PDFs**: Full PDF documents (up to 20MB)

## Troubleshooting

### Common Issues

#### 1. Access Denied Error

```
AWS Access Denied - Check IAM permissions and model access
```

**Solution:** Verify IAM permissions and ensure model access is granted in Bedrock console.

#### 2. Model Not Available

```
ValidationException: The model 'anthropic.claude-3-5-sonnet-20241022-v2:0' is not available in region 'us-west-2'
```

**Solution:** Use `us-east-1` region or check model availability in your region.

#### 3. Rate Limiting

```
ThrottlingException: Rate exceeded
```

**Solution:** Implement retry logic or reduce request frequency.

#### 4. Invalid Credentials

```
AWS credentials are required
```

**Solution:** Ensure environment variables are set correctly.

### Debug Mode

The service includes detailed logging. Check your server console for:

- Request details
- Response parsing attempts
- Error messages with stack traces

### Testing with Sample Files

Create test files in different formats:

- Small menu image (< 1MB)
- PDF menu (< 5MB)
- Large file (> 20MB) to test size limits

## Cost Considerations

### Pricing Structure

- **Input tokens**: ~$3 per million tokens
- **Output tokens**: ~$15 per million tokens
- **Images**: Additional cost per image processed

### Cost Optimization Tips

1. **Optimize images**: Compress images before processing
2. **Batch processing**: Process multiple items in one request when possible
3. **Monitor usage**: Use AWS CloudWatch to track costs
4. **Set budgets**: Configure AWS budgets to avoid unexpected charges

## Migration Benefits

✅ **Better PDF Support**: Native PDF processing without conversion  
✅ **Higher Accuracy**: Claude 3.5 Sonnet has excellent vision capabilities  
✅ **Larger Files**: Supports up to 20MB files (vs 10MB with Gemini)  
✅ **Enterprise Ready**: AWS infrastructure with better reliability  
✅ **Cost Transparency**: Detailed usage tracking through AWS

## Security Best Practices

1. **Rotate Keys**: Regularly rotate AWS access keys
2. **Least Privilege**: Only grant necessary permissions
3. **Environment Variables**: Never hardcode credentials
4. **VPC**: Consider using VPC endpoints for enhanced security
5. **CloudTrail**: Enable logging for audit trails

## Monitoring and Alerts

### CloudWatch Metrics

- Model invocation count
- Error rates
- Response times
- Token usage

### Recommended Alerts

- High error rate (> 5%)
- Unusual token usage spikes
- Failed authentication attempts

## Support

For issues related to:

- **AWS Bedrock**: Check AWS documentation or support
- **Application Integration**: Review this guide and check logs
- **Model Performance**: Test with different prompts or file formats

## Next Steps

1. Set up monitoring and alerts
2. Implement caching for frequently processed menus
3. Consider batch processing for multiple files
4. Set up automated testing with sample menu files
