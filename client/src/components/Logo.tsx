import logo from "@/assets/logo.png";

export default function Logo(props: { className?: string }) {
  const { className } = props;

  return (
    <>
      <img src={logo} className={className} alt="logo" />
    </>
  );
}
