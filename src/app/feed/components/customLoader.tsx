"use client";

export function CustomLoader() {
  return (
    <section className="bg-white font-serif h-screen flex items-center justify-center absolute top-0 left-0 w-full z-50">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            ></div>
            <div className="mt-[-50px]">
              <h3 className="text-2xl text-black sm:text-3xl font-bold mb-4">
                Loading the page
              </h3>
              <p className="mb-6 text-black sm:mb-5">
                Fetching the data from the server...
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
