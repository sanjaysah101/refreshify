import { NextRequest, NextResponse } from "next/server";

import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    const screenshot = await page.screenshot({
      type: "png",
      encoding: "base64",
      fullPage: true,
    });

    const styles = await extractStyles(page);
    const content = await page.content();
    await browser.close();

    const $ = cheerio.load(content);

    const metadata = {
      title: $("title").text() || "",
      description: $("meta[name=\"description\"]").attr("content") || "",
      keywords: $("meta[name=\"keywords\"]").attr("content")?.split(",") || [],
      language: $("html").attr("lang") || "en",
    };

    const structure = {
      header: extractHeader($),
      navigation: extractNavigation($),
      main: extractAdvancedContent($),
      sidebar: extractSidebar($),
      footer: extractFooter($),
    };

    return NextResponse.json({
      success: true,
      data: {
        url,
        screenshot: `data:image/png;base64,${screenshot}`,
        metadata,
        structure,
        styles,
        extractedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json({ error: "Failed to scrape website" }, { status: 500 });
  }
}

function extractHeader($: cheerio.CheerioAPI) {
  const header = $("header, .header, #header").first();
  return {
    logo: header.find("img").first().attr("src") || header.find(".logo").text() || "",
    title: header.find("h1").first().text() || $("h1").first().text() || "",
    tagline: header.find(".tagline, .subtitle").first().text() || "",
  };
}

function extractNavigation($: cheerio.CheerioAPI) {
  const nav = $("nav, .nav, .navigation, .menu").first();
  const items: any[] = [];

  nav.find("a").each((_, el) => {
    const $el = $(el);
    items.push({
      label: $el.text().trim(),
      href: $el.attr("href") || "#",
    });
  });

  return {
    items,
    style: nav.hasClass("vertical") ? "vertical" : "horizontal",
  };
}

function extractAdvancedContent($: cheerio.CheerioAPI) {
  return {
    hero: extractHeroSection($),
    features: extractFeatures($),
    testimonials: extractTestimonials($),
    callToAction: extractCallToAction($),
    images: extractImages($),
    forms: extractForms($),
  };
}

function extractHeroSection($: cheerio.CheerioAPI) {
  const hero = $(".hero, .banner, .jumbotron, .intro").first();
  if (!hero.length) return null;

  return {
    title: hero.find("h1, h2").first().text().trim(),
    subtitle: hero.find("p, .subtitle").first().text().trim(),
    backgroundImage: hero.find("img").first().attr("src") || hero.css("background-image"),
    ctaButton: {
      text: hero.find("a, button").first().text().trim(),
      href: hero.find("a").first().attr("href") || "#",
    },
  };
}

function extractFeatures($: cheerio.CheerioAPI) {
  const features: any[] = [];
  $(".feature, .service, .benefit").each((_, el) => {
    const $el = $(el);
    features.push({
      title: $el.find("h3, h4").first().text().trim(),
      description: $el.find("p").first().text().trim(),
      icon: $el.find("img, .icon").first().attr("src") || $el.find(".icon").text().trim(),
    });
  });
  return features;
}

function extractTestimonials($: cheerio.CheerioAPI) {
  const testimonials: any[] = [];
  $(".testimonial, .review, .quote").each((_, el) => {
    const $el = $(el);
    testimonials.push({
      text: $el.find("p, .quote-text").first().text().trim(),
      author: $el.find(".author, .name").first().text().trim(),
      company: $el.find(".company, .title").first().text().trim(),
    });
  });
  return testimonials;
}

function extractCallToAction($: cheerio.CheerioAPI) {
  const cta = $(".cta, .call-to-action, .signup").first();
  if (!cta.length) return null;

  return {
    title: cta.find("h2, h3").first().text().trim(),
    description: cta.find("p").first().text().trim(),
    button: {
      text: cta.find("a, button").first().text().trim(),
      href: cta.find("a").first().attr("href") || "#",
    },
  };
}

function extractImages($: cheerio.CheerioAPI) {
  const images: any[] = [];
  $("img").each((_, el) => {
    const $el = $(el);
    const src = $el.attr("src");
    if (src && !src.includes("data:")) {
      images.push({
        src,
        alt: $el.attr("alt") || "",
        width: $el.attr("width"),
        height: $el.attr("height"),
      });
    }
  });
  return images.slice(0, 10);
}

function extractForms($: cheerio.CheerioAPI) {
  const forms: any[] = [];
  $("form").each((_, el) => {
    const $el = $(el);
    const fields: any[] = [];
    $el.find("input, textarea, select").each((_, field) => {
      const $field = $(field);
      fields.push({
        type: $field.attr("type") || $field.prop("tagName")?.toLowerCase(),
        name: $field.attr("name"),
        placeholder: $field.attr("placeholder"),
        required: $field.attr("required") !== undefined,
      });
    });
    forms.push({
      action: $el.attr("action"),
      method: $el.attr("method") || "GET",
      fields,
    });
  });
  return forms;
}

function extractSidebar($: cheerio.CheerioAPI) {
  const sidebar = $(".sidebar, .aside, aside").first();
  if (!sidebar.length) return null;

  const widgets: any[] = [];
  sidebar.find(".widget, .module").each((_, el) => {
    const $el = $(el);
    widgets.push({
      type: "custom",
      title: $el.find("h3, h4").first().text(),
      content: $el.html(),
    });
  });

  return {
    widgets,
    position: sidebar.hasClass("left") ? "left" : "right",
  };
}

function extractFooter($: cheerio.CheerioAPI) {
  const footer = $("footer, .footer, #footer").first();
  if (!footer.length) return null;

  const columns: any[] = [];
  footer.find(".column, .col").each((_, el) => {
    const $el = $(el);
    const links: any[] = [];
    $el.find("a").each((_, linkEl) => {
      const $link = $(linkEl);
      links.push({
        label: $link.text().trim(),
        href: $link.attr("href") || "#",
      });
    });
    columns.push({
      title: $el.find("h3, h4").first().text(),
      links,
    });
  });

  return {
    columns,
    copyright: footer.find(".copyright").text() || "",
    style: columns.length > 1 ? "multi-column" : "simple",
  };
}

async function extractStyles(page: any) {
  try {
    return await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        colors: {
          primary: computedStyle.color || "#000000",
          background: computedStyle.backgroundColor || "#ffffff",
          text: computedStyle.color || "#000000",
          secondary: "#666666",
        },
        typography: {
          headingFont: computedStyle.fontFamily || "Arial, sans-serif",
          bodyFont: computedStyle.fontFamily || "Arial, sans-serif",
          sizes: {
            h1: "2rem",
            h2: "1.5rem",
            h3: "1.25rem",
            body: "1rem",
            small: "0.875rem",
          },
        },
        spacing: {
          xs: "0.25rem",
          sm: "0.5rem",
          md: "1rem",
          lg: "1.5rem",
          xl: "2rem",
          xxl: "3rem",
          section: "2rem",
          component: "1rem",
        },
        layout: {
          type: "responsive",
          maxWidth: "1200px",
          columns: 12,
          gaps: {
            row: "1rem",
            column: "1rem",
          },
          breakpoints: {
            mobile: "640px",
            tablet: "768px",
            desktop: "1024px",
            wide: "1280px",
          },
        },
      };
    });
  } catch (error) {
    console.error("Error extracting styles:", error);
    return {
      colors: {
        primary: "#000000",
        background: "#ffffff",
        text: "#000000",
        secondary: "#666666",
      },
      typography: {
        headingFont: "Arial, sans-serif",
        bodyFont: "Arial, sans-serif",
        sizes: {
          h1: "2rem",
          h2: "1.5rem",
          h3: "1.25rem",
          body: "1rem",
          small: "0.875rem",
        },
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        xxl: "3rem",
        section: "2rem",
        component: "1rem",
      },
      layout: {
        type: "responsive",
        maxWidth: "1200px",
        columns: 12,
        gaps: {
          row: "1rem",
          column: "1rem",
        },
        breakpoints: {
          mobile: "640px",
          tablet: "768px",
          desktop: "1024px",
          wide: "1280px",
        },
      },
    };
  }
}
