import Image from "next/image";

export default function Page() {
  return (
    <div className="bg-white h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <Image
            className="absolute -top-1.5  right-2.5"
            src={"/kaipo.png"}
            alt="kaipo-logo"
            width={200}
            height={150}
          />
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Sudah tau ini aplikasi namanya apa
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              Projectnya tidur, ownernya kabur, dokternya takabur, developernya
              nganggur tapi udah mulai kerja, tapi boong.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Bukan login
              </a>
              <a href="#" className="text-sm/6 font-semibold text-gray-900">
                Resign <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
