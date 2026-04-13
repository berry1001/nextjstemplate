export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-red-500">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-primary/10" />

      <main className="container relative z-10 flex max-w-4xl flex-col items-center justify-center gap-10 px-4 py-16 text-center md:py-24">
        <div className="space-y-8">
          <h1 className="text-2xl font-light tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Build anything with{" "}
            <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Pastel
            </span>
          </h1>
          <p className="mx-auto max-w-lg text-sm text-black md:text-base">
            Your Next.js website is on the way. Let Pastel Cook.
          </p>
        </div>
      </main>
    </div>
  );
}
