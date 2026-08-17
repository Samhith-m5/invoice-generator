import imgImage406 from "./b41764a0165aa1cc9c868af67635319de3a2ee4c.png";
import imgImage336 from "./ab3599c73a8ab20c8a1dbf57c7d49e34852c6480.png";

function Frame() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[50px] relative size-full">
          <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[30px] text-black text-center tracking-[-0.3px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
            Invoice Details
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[150px] items-center relative shrink-0">
      <p className="relative shrink-0 w-[190px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Invoice Date
      </p>
      <p className="relative shrink-0 w-[190px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Due Date
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="[word-break:break-word] content-stretch flex font-['SF_Pro:Medium',sans-serif] font-[510] gap-[150px] items-start leading-[normal] px-[50px] relative size-full text-[#1d1d1f] text-[24px] tracking-[-0.24px]">
          <p className="relative shrink-0 w-[192px]" style={{ fontVariationSettings: '"wdth" 100' }}>
            Invoice Number
          </p>
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[150px] items-center min-w-px relative tracking-[-0.72px]">
      <p className="relative shrink-0 w-[190px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        July 24, 2026
      </p>
      <p className="relative shrink-0 w-[190px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        July 25, 2026
      </p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['SF_Pro:Regular',sans-serif] font-normal gap-[150px] items-start leading-[normal] overflow-clip pb-[15px] px-[50px] relative shrink-0 text-[#1d1d1f] text-[24px] w-[1350px]">
      <p className="relative shrink-0 tracking-[-0.24px] w-[192px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        MCT-10-2026-28
      </p>
      <Frame5 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="-scale-y-100 flex-none">
        <div className="bg-[rgba(142,142,142,0.54)] h-[1.25px] relative rounded-[83.916px] w-[1300px]" />
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
      <Frame1 />
      <Frame2 />
      <Frame8 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row justify-end overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-end px-[50px] relative size-full">
          <p className="[word-break:break-word] font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#1d1d1f] text-[22px] tracking-[-0.22px] w-[250px]" style={{ fontVariationSettings: '"wdth" 100' }}>
            Authorised By
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-start justify-end overflow-clip px-[50px] relative shrink-0 w-[1350px]">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#1d1d1f] text-[22px] tracking-[-0.22px] w-[250px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        G Chandra Shekar Reddy
      </p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="h-[190px] overflow-clip relative shrink-0 w-[321px]">
      <div className="absolute left-0 size-[250px] top-[-30.25px]" data-name="image 406">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage406} />
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[265.423px] items-center justify-center left-[calc(50%-57.38px)] top-[calc(50%+12.33px)] w-[244.931px]">
        <div className="flex-none rotate-[14.12deg]">
          <div className="h-[224.351px] relative w-[196.115px]" data-name="image 336">
            <img alt="" className="absolute block inset-0 max-w-none size-full" height="224.351" src={imgImage336} width="196.115" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-end relative shrink-0 w-full">
      <Frame9 />
      <Frame10 />
      <Frame11 />
    </div>
  );
}

export default function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[44px] items-start relative size-full">
      <Frame />
      <Frame6 />
      <Frame7 />
    </div>
  );
}