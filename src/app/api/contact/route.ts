import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  category?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // 验证必填字段
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 验证消息长度
    if (body.message.length < 10) {
      return NextResponse.json(
        { error: '消息内容至少需要10个字符' },
        { status: 400 }
      );
    }

    if (body.message.length > 2000) {
      return NextResponse.json(
        { error: '消息内容不能超过2000个字符' },
        { status: 400 }
      );
    }

    // 构建邮件内容
    const emailContent = {
      to: 'support@inspopmars.com', // 接收邮箱
      from: body.email,
      name: body.name,
      subject: body.subject || '来自网站的联系表单',
      category: body.category || '其他',
      message: body.message,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || '',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '未知'
    };

    // 这里可以集成邮件服务，比如 SendGrid, AWS SES, Nodemailer 等
    // 目前先记录到控制台，实际使用时替换为真实的邮件发送逻辑
    console.log('收到联系表单提交:', emailContent);

    // 模拟邮件发送
    // 在生产环境中，你需要配置实际的邮件服务
    const simulateEmailSend = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    };

    await simulateEmailSend();

    // 返回成功响应
    return NextResponse.json(
      {
        success: true,
        message: '您的消息已成功发送！我们会尽快回复您。',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('联系表单处理错误:', error);
    
    return NextResponse.json(
      { 
        error: '服务器错误，请稍后重试',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/* 
生产环境邮件发送示例（使用 SendGrid）:

import sgMail from '@sendgrid/mail';

// 配置 SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg = {
  to: 'support@inspopmars.com',
  from: 'noreply@inspopmars.com',
  subject: `联系表单: ${body.subject || '用户咨询'}`,
  html: `
    <h2>新的联系表单提交</h2>
    <p><strong>姓名:</strong> ${body.name}</p>
    <p><strong>邮箱:</strong> ${body.email}</p>
    <p><strong>主题:</strong> ${body.subject || '无主题'}</p>
    <p><strong>类别:</strong> ${body.category || '其他'}</p>
    <p><strong>消息:</strong></p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
      ${body.message.replace(/\n/g, '<br>')}
    </div>
    <hr>
    <p><small>提交时间: ${new Date().toLocaleString('zh-CN')}</small></p>
    <p><small>IP地址: ${emailContent.ip}</small></p>
  `,
};

await sgMail.send(msg);
*/