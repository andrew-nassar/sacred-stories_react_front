import { useState, useEffect } from "react";
import { getSacredStoryById } from "../api/saintDetailsApi";
import { SacredStoryData } from "../types/saintDetails.types";

export function useSaintDetails(selectedSaintId: string | null) {
  const [data, setData] = useState<SacredStoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSaintId) return;

    let isMounted = true;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const storyData = await getSacredStoryById(selectedSaintId);

const sortedTimeline = [...(storyData.timeline ?? [])].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);

if (isMounted) {
  setData({
    ...storyData,
    timeline: sortedTimeline,
  });
}
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "An error occurred while fetching details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [selectedSaintId]);

  return { data, loading, error };
}