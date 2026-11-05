import React from 'react';
import { MUNICIPALITY_INFO } from '../../utils/constants';

export const PermitBacksidePrint: React.FC = () => {
  return (
    <div className="gov-doc bg-white text-black p-8 sm:p-14 max-w-[210mm] mx-auto shadow-md print:shadow-none print:p-0 print:max-w-none text-[16px] leading-[2.2] min-h-[280mm] flex flex-col justify-between font-sarabun">
      <div>
        {/* Subtle Watermark Header */}
        <div className="text-center text-xs text-gray-400 font-bold tracking-wider mb-8 uppercase">
          {MUNICIPALITY_INFO.name}
        </div>

        {/* Header: ข้อปฏิบัติ */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-sarabun tracking-wide inline-block border-b-2 border-black pb-1">
            ข้อปฏิบัติ
          </h2>
        </div>

        {/* 4 Rules */}
        <div className="space-y-6 text-justify px-4 sm:px-8 font-medium">
          <div className="flex items-start">
            <span className="font-bold mr-3 text-lg shrink-0">๑.</span>
            <span>
              จะต้องนำใบอนุญาตนี้ไปแจ้งต่อเจ้าหน้าที่ตำรวจท้องที่ลงนามรับทราบเสียก่อน จึงจะทำการโฆษณาได้
            </span>
          </div>

          <div className="flex items-start">
            <span className="font-bold mr-3 text-lg shrink-0">๒.</span>
            <span>
              ต้องเก็บรักษาใบอนุญาตนี้และใบอนุญาตให้มีเพื่อใช้ฯ ไว้กับเครื่องในที่เปิดเผยเพื่อสะดวกแก่พนักงานเจ้าหน้าที่ ที่จะตรวจดูได้ทุกขณะ
            </span>
          </div>

          <div className="flex items-start">
            <span className="font-bold mr-3 text-lg shrink-0">๓.</span>
            <span>
              เมื่อใบอนุญาตสิ้นอายุลงหรือถูกสั่งให้หยุดทำการโฆษณาหรือถูกเพิกถอน ซึ่งจะเป็นด้วยกรณีใดก็ตาม ต้องหยุดทำการโฆษณาทันที
            </span>
          </div>

          <div className="flex items-start">
            <span className="font-bold mr-3 text-lg shrink-0">๔.</span>
            <span>
              ต้องปฏิบัติตามคำแนะนำตักเตือน ของพนักงานเจ้าหน้าที่รวมทั้งเจ้าหน้าที่ตำรวจในท้องที่ด้วย
            </span>
          </div>
        </div>

        {/* Section: คำบันทึกรับทราบของเจ้าหน้าที่ตำรวจท้องที่ */}
        <div className="mt-20 pt-8 border-t border-dashed border-gray-300">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold font-sarabun tracking-wide inline-block border-b border-black pb-0.5">
              คำบันทึกรับทราบของเจ้าหน้าที่ตำรวจท้องที่
            </h3>
          </div>

          <div className="space-y-6 px-4 sm:px-12">
            <div className="text-left indent-8">
              เจ้าหน้าที่ตำรวจท้องที่นี้ได้ทราบ ตั้งแต่วันที่{' '}
              <span className="dotted-fill min-w-[200px] text-center font-bold">
                .......... / .......... / ..........
              </span>
            </div>

            <div className="text-left indent-8">
              เวลา{' '}
              <span className="dotted-fill min-w-[200px] text-center font-bold">
                ..............................
              </span>{' '}
              น.
            </div>

            {/* Police Signature Block */}
            <div className="mt-16 flex justify-end">
              <div className="text-center w-80 space-y-4">
                <div className="flex items-center justify-center">
                  <span>ลงชื่อ</span>
                  <span className="dotted-fill min-w-[220px] text-center"></span>
                </div>
                <div className="flex items-center justify-center">
                  <span>ตำแหน่ง</span>
                  <span className="dotted-fill min-w-[210px] text-center"></span>
                </div>
                <div className="flex items-center justify-center">
                  <span>วันที่</span>
                  <span className="dotted-fill min-w-[220px] text-center">
                    .......... / .......... / ..........
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-gray-400 text-center border-t border-gray-200 pt-3">
        ด้านหลังใบอนุญาต แบบ ฆ.ษ. ๒ | {MUNICIPALITY_INFO.name} อำเภอนาแก จังหวัดนครพนม
      </div>
    </div>
  );
};
