interface FooterColumnProps {
  title: string;
  links: string[];
}

export default function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-row grow items-end self-stretch">
      <div className="flex flex-col gap-3.5 grow h-full items-start justify-start">
        <div className="flex flex-col items-start justify-start w-full">
          <div className="font-bold text-white text-[11.916px] leading-[17.5px] w-full">
            {title}
          </div>
        </div>
        <div className="flex flex-col gap-[10.5px] items-start justify-start w-full">
          {links.map((link, index) => (
            <div key={index} className="flex flex-col items-start justify-start pb-0.5 pt-px w-full">
              <div className="font-normal text-[#a1a1a1] text-[11.531px] leading-[17.5px] w-full">
                {link}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 