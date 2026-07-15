import vi from "@/messages/vi.json";

export default function NotFound() {
  return (
    <main>
      <h1>{vi.errors.notFound.title}</h1>
      <p>{vi.errors.notFound.description}</p>
    </main>
  );
}
