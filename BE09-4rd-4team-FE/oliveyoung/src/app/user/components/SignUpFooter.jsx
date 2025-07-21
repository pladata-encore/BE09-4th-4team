'use client';

export default function SignUpFooter() {
  return (
    <footer className="min-h-[238px] h-[10vh] bg-[#2b2b2b] text-gray-400 text-xs py-6">
      <div className="container mx-auto px-4 text-center space-y-2 leading-relaxed">
        <p>
          대표이사 &nbsp; 유인상 &nbsp;&nbsp;&nbsp;&nbsp; 주소 &nbsp; 04323 &nbsp; 서울시 &nbsp;
          용산구 &nbsp; 한강대로 &nbsp; 366 &nbsp; 트윈시티 &nbsp; 10층 &nbsp;&nbsp; CJ ONE 고객센터
          1577-8888 &nbsp;&nbsp; 사업자 등록번호 104-81-36565
        </p>
        <p>
          호스팅사업자 &nbsp; CJ올리브네트웍스 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 통신판매업신고번호
          2017-서울용산-0451
        </p>
        <div className="flex justify-center items-center space-x-2 mt-2">
          <img
            src="https://www.cjone.com/cjmweb/images/common/logo_cjolivenetworks_footer.png" // CJ올리브네트웍스 로고 이미지 URL
            alt="CJ 올리브네트웍스 로고"
            className="h-4"
          />
          <span>Copyright (c)2016 CJ OLIVENETWORKS. All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}
