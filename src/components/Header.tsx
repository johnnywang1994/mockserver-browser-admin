import { FC, memo } from 'react';

const Header: FC = () => {
  return (
    <>
      <div className="fixed top-0 w-full h-[45px] text-white bg-[#142340] flex items-center font-bold px-8 select-none z-10">
        <div>MockServer Browser Admin</div>
      </div>
      <div className="pt-[45px]"></div>
    </>
  );
};

export default memo(Header);
