import { NextRequest, NextResponse } from "next/server";

import puppeteer from "puppeteer";

import { analyzeAndModernizeUrl } from "../../../lib/geminiService";

export async function POST(request: NextRequest) {
  try {
    const { scrapedData, theme } = await request.json();

    if (!scrapedData || !theme) {
      return NextResponse.json({ error: "Scraped data and theme are required" }, { status: 400 });
    }

    // Generate transformed HTML based on theme
    // const transformedHtml = generateTransformedHtml(scrapedData, theme);
    const transformedHtml = await analyzeAndModernizeUrl(scrapedData.url, scrapedData.originalHTML);

    // Create screenshot of transformed version
    const screenshot = await generateTransformedScreenshot(transformedHtml);

    return NextResponse.json({
      success: true,
      data: {
        html: transformedHtml,
        screenshot: `data:image/png;base64,${screenshot}`,
        theme,
        transformedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Transform error:", error);
    return NextResponse.json({ error: "Failed to transform website" }, { status: 500 });
  }
}

// Replace the existing generateTransformedHtml function
function generateTransformedHtml(scrapedData: any, theme: string): string {
  const { metadata, structure, styles } = scrapedData;

  // Enhanced theme configurations
  const themeConfigs = {
    classic: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      primaryColor: "#2c3e50",
      secondaryColor: "#34495e",
      backgroundColor: "#f8f9fa",
      accentColor: "#3498db",
      borderRadius: "4px",
      shadows: "box-shadow: 0 2px 8px rgba(0,0,0,0.1);",
      spacing: "1.5rem",
      headerStyle: "border-bottom: 3px solid #3498db; padding: 2rem 0;",
      cardStyle: "border: 1px solid #dee2e6; background: white;",
    },
    modern: {
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      primaryColor: "#1a202c",
      secondaryColor: "#2d3748",
      backgroundColor: "#ffffff",
      accentColor: "#667eea",
      borderRadius: "12px",
      shadows: "box-shadow: 0 4px 20px rgba(0,0,0,0.08);",
      spacing: "2rem",
      headerStyle: "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 0;",
      cardStyle: "background: white; border: 1px solid #e2e8f0;",
    },
    morphism: {
      fontFamily: '"Poppins", sans-serif',
      primaryColor: "#ffffff",
      secondaryColor: "#f1f5f9",
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      accentColor: "#ffffff",
      borderRadius: "20px",
      shadows:
        "box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.18);",
      spacing: "2.5rem",
      headerStyle:
        "background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 255, 255, 0.2);",
      cardStyle:
        "background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);",
    },
    animated: {
      fontFamily: '"Roboto", sans-serif',
      primaryColor: "#2d3748",
      secondaryColor: "#4a5568",
      backgroundColor: "#f7fafc",
      accentColor: "#ff6b6b",
      borderRadius: "16px",
      shadows:
        "box-shadow: 0 10px 30px rgba(0,0,0,0.1); transform: translateY(0); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);",
      spacing: "2rem",
      headerStyle:
        "background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; transform: translateY(0); transition: transform 0.3s ease;",
      cardStyle: "background: white; transform: translateY(0); transition: all 0.3s ease;",
    },
  };

  const config = themeConfigs[theme as keyof typeof themeConfigs] || themeConfigs.modern;

  // Generate enhanced HTML with better structure
  return `
    <!DOCTYPE html>
    <html lang="${metadata.language || "en"}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${metadata.title}</title>
      <meta name="description" content="${metadata.description}">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
      <style>
        ${generateThemeCSS(config, theme)}
      </style>
    </head>
    <body>
      ${generateHeader(structure, config, theme)}
      ${generateMain(structure, config, theme)}
      ${generateFooter(structure, config, theme)}
      ${theme === "animated" ? generateAnimationScript() : ""}
    </body>
    </html>
  `;
}

function generateThemeCSS(config: any, theme: string): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: ${config.fontFamily};
      background: ${config.backgroundColor};
      color: ${config.primaryColor};
      line-height: 1.6;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 ${config.spacing};
    }
    
    .header {
      ${config.headerStyle}
      position: relative;
      overflow: hidden;
    }
    
    .nav {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
    
    .nav a {
      text-decoration: none;
      color: inherit;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: ${config.borderRadius};
      transition: all 0.3s ease;
    }
    
    .nav a:hover {
      background: ${config.accentColor};
      color: white;
      transform: translateY(-2px);
    }
    
    .main {
      padding: 3rem 0;
    }
    
    .hero {
      text-align: center;
      padding: 4rem 0;
      margin-bottom: 3rem;
    }
    
    .hero h1 {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      ${theme === "animated" ? "animation: fadeInUp 1s ease;" : ""}
    }
    
    .hero p {
      font-size: 1.25rem;
      opacity: 0.8;
      max-width: 600px;
      margin: 0 auto 2rem;
      ${theme === "animated" ? "animation: fadeInUp 1s ease 0.2s both;" : ""}
    }
    
    .cta-button {
      display: inline-block;
      padding: 1rem 2rem;
      background: ${config.accentColor};
      color: white;
      text-decoration: none;
      border-radius: ${config.borderRadius};
      font-weight: 600;
      transition: all 0.3s ease;
      ${theme === "animated" ? "animation: fadeInUp 1s ease 0.4s both;" : ""}
    }
    
    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: ${config.spacing};
      margin: 3rem 0;
    }
    
    .card {
      ${config.cardStyle}
      padding: ${config.spacing};
      border-radius: ${config.borderRadius};
      ${config.shadows}
      transition: all 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
      ${theme === "morphism" ? "background: rgba(255, 255, 255, 0.25);" : ""}
    }
    
    .footer {
      background: ${config.secondaryColor};
      color: white;
      padding: 3rem 0 2rem;
      margin-top: 4rem;
    }
    
    @media (max-width: 768px) {
      .hero h1 { font-size: 2rem; }
      .nav { flex-direction: column; gap: 0.5rem; }
      .grid { grid-template-columns: 1fr; }
    }
    
    ${
      theme === "animated"
        ? `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .card:hover {
        animation: pulse 0.6s ease;
      }
    `
        : ""
    }
  `;
}

function generateHeader(structure: any, config: any, theme: string): string {
  return `
    <header class="header">
      <div class="container">
        <h1>${structure.header?.title || "Website Title"}</h1>
        ${structure.header?.tagline ? `<p>${structure.header.tagline}</p>` : ""}
        ${
          structure.navigation?.items
            ? `
          <nav class="nav">
            ${structure.navigation.items.map((item: any) => `<a href="${item.href}">${item.label}</a>`).join("")}
          </nav>
        `
            : ""
        }
      </div>
    </header>
  `;
}

function generateMain(structure: any, config: any, theme: string): string {
  const blocks = structure.main?.blocks || [];

  return `
    <main class="main">
      <div class="container">
        <section class="hero">
          <h1>Welcome to Our Modernized Website</h1>
          <p>Experience the power of modern web design with enhanced user experience and beautiful aesthetics.</p>
          <a href="#" class="cta-button">Get Started</a>
        </section>

        <div class="grid">
          ${blocks
            .map(
              (block: any, index: number) => `
            <div class="card" ${theme === "animated" ? `style="animation-delay: ${index * 0.1}s"` : ""}>
              ${generateBlockContent(block)}
            </div>
          `
            )
            .join("")}
          
          ${
            blocks.length === 0
              ? `
            <div class="card">
              <h3>Feature One</h3>
              <p>Discover amazing features that will transform your experience.</p>
            </div>
            <div class="card">
              <h3>Feature Two</h3>
              <p>Built with modern technologies for optimal performance.</p>
            </div>
            <div class="card">
              <h3>Feature Three</h3>
              <p>Responsive design that works perfectly on all devices.</p>
            </div>
          `
              : ""
          }
        </div>
      </div>
    </main>
  `;
}

function generateBlockContent(block: any): string {
  switch (block.type) {
    case "image":
      return `<img src="${block.content.src}" alt="${block.content.alt}" style="max-width: 100%; height: auto; border-radius: 8px;">`;
    case "list":
      return `<ul>${block.content.items?.map((item: string) => `<li>${item}</li>`).join("") || ""}</ul>`;
    case "text":
    default:
      return `<p>${block.content.text || "Content will be displayed here"}</p>`;
  }
}

function generateFooter(structure: any, config: any, theme: string): string {
  return `
    <footer class="footer">
      <div class="container">
        <div class="grid">
          <div>
            <h4>About</h4>
            <p>Modernized with cutting-edge design principles.</p>
          </div>
          <div>
            <h4>Links</h4>
            <ul style="list-style: none; padding: 0;">
              <li><a href="#" style="color: inherit; text-decoration: none;">Home</a></li>
              <li><a href="#" style="color: inherit; text-decoration: none;">About</a></li>
              <li><a href="#" style="color: inherit; text-decoration: none;">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <p>Get in touch with us today.</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">
          <p>${structure.footer?.copyright || "© 2024 Modernized Website. All rights reserved."}</p>
        </div>
      </div>
    </footer>
  `;
}

function generateAnimationScript(): string {
  return `
    <script>
      // Add intersection observer for scroll animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
          }
        });
      }, observerOptions);
      
      document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
      });
    </script>
  `;
}

async function generateTransformedScreenshot(html: string): Promise<string> {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process'
    ]
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 800 });
  await page.setContent(html, { waitUntil: "networkidle0" });

  const screenshot = await page.screenshot({
    type: "png",
    encoding: "base64",
    fullPage: false,
  });

  await browser.close();
  return screenshot;
}