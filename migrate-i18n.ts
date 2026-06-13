import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

const client = new MongoClient(uri);

function toLocalized(field: any): any {
  if (!field) return { en: "", id: "" };
  if (typeof field === "string") {
    return { en: field, id: field };
  }
  return field; // already localized or other type
}

async function migrate() {
  try {
    await client.connect();
    const db = client.db("portfolio");

    console.log("Migrating projects...");
    const projects = await db.collection("projects").find({}).toArray();
    for (const p of projects) {
      await db.collection("projects").updateOne(
        { _id: p._id },
        {
          $set: {
            title: toLocalized(p.title),
            slug: toLocalized(p.slug),
            description: toLocalized(p.description),
            content: toLocalized(p.content),
          },
        }
      );
    }

    console.log("Migrating news...");
    const news = await db.collection("news").find({}).toArray();
    for (const n of news) {
      await db.collection("news").updateOne(
        { _id: n._id },
        {
          $set: {
            title: toLocalized(n.title),
            slug: toLocalized(n.slug),
            excerpt: toLocalized(n.excerpt),
            content: toLocalized(n.content),
          },
        }
      );
    }

    console.log("Migrating services...");
    const services = await db.collection("services").find({}).toArray();
    for (const s of services) {
      await db.collection("services").updateOne(
        { _id: s._id },
        {
          $set: {
            title: toLocalized(s.title),
            description: toLocalized(s.description),
          },
        }
      );
    }

    console.log("Migrating faqs...");
    const faqs = await db.collection("faqs").find({}).toArray();
    for (const f of faqs) {
      await db.collection("faqs").updateOne(
        { _id: f._id },
        {
          $set: {
            question: toLocalized(f.question),
            answer: toLocalized(f.answer),
          },
        }
      );
    }

    console.log("Migrating hero...");
    const hero = await db.collection("hero").findOne({});
    if (hero) {
      await db.collection("hero").updateOne(
        { _id: hero._id },
        {
          $set: {
            line1: toLocalized(hero.line1),
            highlightWord1: toLocalized(hero.highlightWord1),
            separator: toLocalized(hero.separator),
            highlightWord2: toLocalized(hero.highlightWord2),
            line3: toLocalized(hero.line3),
            subtitle: toLocalized(hero.subtitle),
          },
        }
      );
    }

    console.log("Migrating about...");
    const about = await db.collection("about").findOne({});
    if (about) {
      await db.collection("about").updateOne(
        { _id: about._id },
        {
          $set: {
            heading: toLocalized(about.heading),
            description: toLocalized(about.description),
            location: toLocalized(about.location),
          },
        }
      );
    }

    console.log("Migrating footer...");
    const footer = await db.collection("settings").findOne({ type: "footer" });
    if (footer) {
      const heading = {
        primary: toLocalized(footer.heading?.primary),
        secondary: toLocalized(footer.heading?.secondary),
      };
      const copyright = toLocalized(footer.copyright);
      const links = footer.links?.map((group: any) => ({
        title: toLocalized(group.title),
        items: group.items?.map((item: any) => ({
          label: toLocalized(item.label),
          href: item.href,
        })) || [],
      })) || [];

      await db.collection("settings").updateOne(
        { _id: footer._id },
        {
          $set: {
            heading,
            copyright,
            links,
          },
        }
      );
    }

    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed", error);
  } finally {
    await client.close();
  }
}

migrate();
