import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
export const metadata = {
  title: "Thw Wild Oasis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="eng">
      <body>
        <header>
          <Logo />
          <Navigation />
        </header>
        <main>{children}</main>
      </body>
      <footer>Copyright ty The Wild Oasis</footer>
    </html>
  );
}
