export const metadata = {
  title: "Bid Tracker",
  description: "Preconstruction Bid Leveling Tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial" }}>
        {children}
      </body>
    </html>
  );
}
