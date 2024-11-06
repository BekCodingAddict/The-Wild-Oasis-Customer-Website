import Logo from "./_components/Logo";
import Navigation from "./_components/Navigation";
import "@/app/_styles/globals.css";
export const metadata = {
  title: "Thw Wild Oasis",
  title: {
    templete: "%s / Thw Wild Oasis",
    default: "Welcome / The Wild Oasis",
  },
  desciption:
    "Luxurious cabin hotel, located located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="eng">
      <body className="bg-colors-primary-950 text-colors-primary-100 min-h-screen">
        <header>
          <Logo />
          <Navigation />
        </header>
        <main>{children}</main>
        <footer>Copyright ty The Wild Oasis</footer>
      </body>
    </html>
  );
}
