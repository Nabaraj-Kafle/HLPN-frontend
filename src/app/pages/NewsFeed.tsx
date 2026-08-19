import {
  storefrontApi,
  type CategoryItem,
  type VendorItem,
  type NewsfeedItem,
} from "@/lib/store-api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function NewsfeedPage() {
  const { id } = useParams<{ id: string }>();

  const [newsfeed, setNewsfeed] = useState<NewsfeedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsfeed = async () => {
      try {
        setLoading(true);

        const newsfeeds = await storefrontApi.getNewsfeeds();

        const selectedNewsfeed = newsfeeds.find(
          (item) => String(item.id) === String(id),
        );

        if (!selectedNewsfeed) {
          setError("Newsfeed not found");
          return;
        }

        setNewsfeed(selectedNewsfeed);
      } catch (err) {
        console.error("Failed to fetch newsfeed:", err);
        setError("Failed to load newsfeed");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsfeed();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !newsfeed) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold">
          {error || "Newsfeed not found"}
        </h1>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-10">
      <article>
        {newsfeed.image && (
          <img
            src={newsfeed.image}
            alt={newsfeed.title}
            className="mb-6 h-auto max-h-[500px] w-full rounded-lg object-cover"
          />
        )}

        <h1 className="text-3xl font-bold md:text-4xl">{newsfeed.title}</h1>

        <p className="mt-2 text-sm text-gray-500">
          {new Date(newsfeed.created_at).toLocaleDateString()}
        </p>

        <div className="mt-8 whitespace-pre-line text-base leading-7 text-gray-700">
          {newsfeed.content}
        </div>
      </article>
    </main>
  );
}
