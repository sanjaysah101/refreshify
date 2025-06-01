import { NextRequest, NextResponse } from "next/server";

import { previewStorage } from "@/lib/preview-storage";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Await params before accessing properties
  const { id: previewId } = await params;

  if (!previewId || !(await previewStorage.has(previewId))) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Preview Not Found</title></head>
        <body>
          <div style="text-align: center; padding: 50px; font-family: sans-serif;">
            <h1>Preview Not Found</h1>
            <p>This preview link may have expired or doesn't exist.</p>
            <a href="/" style="color: #667eea; text-decoration: none;">← Back to Website Transformer</a>
          </div>
        </body>
      </html>`,
      {
        status: 404,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  const previewData = await previewStorage.get(previewId);
  if (!previewData) {
    return new NextResponse("Preview not found", { status: 404 });
  }

  // Add sharing meta tags and analytics
  const enhancedHtml = addPreviewEnhancements(previewData.html, previewData, previewId);

  return new NextResponse(enhancedHtml, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function addPreviewEnhancements(html: string, data: any, previewId: string): string {
  const enhancements = `
    <!-- Sharing Meta Tags -->
    <meta property="og:title" content="Transformed Website - ${data.theme} Theme" />
    <meta property="og:description" content="View this website transformed with modern design" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    
    <!-- Preview Banner -->
    <style>
      .preview-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 8px 16px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .preview-banner a {
        color: white;
        text-decoration: none;
        font-weight: 500;
      }
      .preview-banner a:hover {
        text-decoration: underline;
      }
      body {
        padding-top: 40px !important;
      }
    </style>
    
    <script>
      // Add preview banner
      document.addEventListener('DOMContentLoaded', function() {
        const banner = document.createElement('div');
        banner.className = 'preview-banner';
        banner.innerHTML = '🎨 This is a preview of a transformed website using <strong>${data.theme}</strong> theme. <a href="/" target="_blank">Create your own →</a>';
        document.body.insertBefore(banner, document.body.firstChild);
      });
    </script>
  `;

  return html.replace("</head>", `${enhancements}</head>`);
}
