import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ailuroWander";

async function fixTourImages() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const toursCollection = db.collection("tours");

    // Get all tours
    const tours = await toursCollection.find().toArray();
    console.log(`Found ${tours.length} tours to update`);

    for (const tour of tours) {
      let updated = false;
      const updateData = {};

      // Check if main image needs updating
      if (tour.images?.main) {
        if (
          tour.images.main === "/images/shanghai.jpg" ||
          tour.images.main === "/images/xian.jpg"
        ) {
          // Use the existing beijing.webp image for all tours
          updateData["images.main"] = "/images/beijing.webp";
          updated = true;
        }
      }

      // Check gallery images
      if (tour.images?.gallery && Array.isArray(tour.images.gallery)) {
        const updatedGallery = tour.images.gallery.map((img) => {
          if (img === "/images/shanghai.jpg" || img === "/images/xian.jpg") {
            return "/images/beijing.webp";
          }
          return img;
        });

        if (
          JSON.stringify(updatedGallery) !== JSON.stringify(tour.images.gallery)
        ) {
          updateData["images.gallery"] = updatedGallery;
          updated = true;
        }
      }

      if (updated) {
        await toursCollection.updateOne(
          { _id: tour._id },
          { $set: updateData },
        );
        console.log(`Updated tour: ${tour.title}`);
      }
    }

    console.log("Tour images updated successfully");
  } catch (error) {
    console.error("Error updating tour images:", error);
  } finally {
    await client.close();
  }
}

fixTourImages().catch(console.error);
