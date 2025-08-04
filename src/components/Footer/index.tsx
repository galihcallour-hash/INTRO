import FooterColumn from './FooterColumn';

export default function Footer() {
  const productLinks = ['Features', 'Pricing', 'Templates', 'Integrations'];
  const resourceLinks = ['Documentation', 'API Reference', 'Community', 'Support'];
  const companyLinks = ['About', 'Blog', 'Careers', 'Contact'];

  return (
    <div className="bg-[#1a1a1a] flex flex-col items-start justify-start left-0 right-0 top-[1295.5px] absolute pb-0 pt-px px-[400px]">
      <div className="absolute border-t border-[#2d2d2d] inset-0 pointer-events-none" />
      <div className="flex flex-col gap-[42px] items-start justify-start max-w-[1120px] pb-[42px] pt-[41px] px-7 w-full">
        
        {/* Main Footer Content */}
        <div className="flex flex-row gap-7 items-end justify-center w-full">
          {/* Company Info */}
          <div className="flex flex-col gap-[26.86px] grow h-[147px] items-start justify-start">
            <div className="flex flex-row h-[31.5px] items-center justify-start w-full">
              <div className="flex flex-col h-[21px] items-start justify-center w-[163px]">
                <div className="flex flex-row grow items-center justify-start w-full">
                  <div className="h-[19px] w-[106px] font-bold text-white text-lg">
                    OurBook
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start pb-[0.77px] w-full">
              <div className="font-normal text-[#a1a1a1] text-[11.339px] leading-[19.91px] w-full">
                <p className="mb-0">A comprehensive documentation platform for</p>
                <p className="mb-0">teams to create, share, and maintain their</p>
                <p className="mb-0">knowledge base with powerful collaboration</p>
                <p>features.</p>
              </div>
            </div>
          </div>

          {/* Footer Columns */}
          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-row items-center justify-between pb-0 pt-7 w-full">
          <div className="absolute border-t border-[#2d2d2d] inset-0 pointer-events-none" />
          <div className="flex flex-col items-start justify-start">
            <div className="font-normal text-[#a1a1a1] text-[11.339px] leading-[17.5px] whitespace-pre">
              © 2024 OurBook. All rights reserved.
            </div>
          </div>
          <div className="flex flex-row items-end justify-start">
            <div className="h-[17.5px] w-[96.56px] relative">
              <div className="absolute bottom-0 flex flex-col items-start justify-start left-0 top-[-1px]">
                <div className="font-normal text-[#a1a1a1] text-[11.531px] leading-[17.5px] whitespace-pre">
                  Privacy Policy
                </div>
              </div>
            </div>
            <div className="h-[17.5px] w-[112.83px] relative">
              <div className="absolute bottom-0 flex flex-col items-start justify-start left-0 top-[-1px]">
                <div className="font-normal text-[#a1a1a1] text-[11.531px] leading-[17.5px] whitespace-pre">
                  Terms of Service
                </div>
              </div>
            </div>
            <div className="flex flex-row items-end self-stretch">
              <div className="flex flex-col h-full items-start justify-start">
                <div className="font-normal text-[#a1a1a1] text-[11.531px] leading-[17.5px] whitespace-pre">
                  Cookie Policy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 