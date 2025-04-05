import gemini from "@/assets/gemini.png";

export default function Gemini(props: { className?: string }) {
  const { className } = props;

  return (
    <>
      <img src={gemini} className={className} alt="logo" />
    </>
  );
}
