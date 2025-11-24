import axios from "axios";

export const fetchBookCover = async (title: string, author: string) => {
  try {
    const query = `${title} ${author}`;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      query
    )}`;

    const response = await axios.get(url);

    const item = response.data.items?.[0];

    if (!item) return null;

    return (
      item.volumeInfo.imageLinks?.thumbnail ||
      item.volumeInfo.imageLinks?.smallThumbnail ||
      null
    );
  } catch (err) {
    console.error("Google Books API Error:", err);
    return null;
  }
};
