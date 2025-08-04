import Navigation from './Navigation';

export default function Header() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="backdrop-blur-sm backdrop-filter sticky top-0 pointer-events-auto">
        <div className="absolute border-b border-neutral-800/30 inset-0 pointer-events-none" />
        
        {/* Top Header Bar */}
        <div className="flex flex-row h-14 items-center justify-between px-7 py-0 relative w-full">
          <div className="font-bold text-lg text-neutral-50">
            INTRO
          </div>
          <div className="flex flex-row-reverse items-center">
            <div className="bg-[#359aba] flex items-center justify-center h-[34px] px-3.5 rounded-md">
              <div className="font-normal text-white text-xs">
                Sign in
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Navigation />
      </div>
    </div>
  );
} 