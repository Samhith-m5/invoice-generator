import imgImage336 from "./ab3599c73a8ab20c8a1dbf57c7d49e34852c6480.png";

function Frame() {
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

function Frame1() {
  return (
    <div className="content-stretch flex items-start justify-end overflow-clip px-[50px] relative shrink-0 w-[1350px]">
      <p className="[word-break:break-word] font-['SF_Pro:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#1d1d1f] text-[22px] tracking-[-0.22px] w-[250px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        G Chandra Shekar Reddy
      </p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[190px] overflow-clip relative shrink-0 w-[321px]">
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

export default function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-end relative size-full">
      <Frame />
      <Frame1 />
      <Frame3 />
    </div>
  );
}