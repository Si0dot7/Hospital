import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">🏥 Hospital HR Service Portal</h1>
      <p className="text-gray-600 mb-6">ระบบกลางสำหรับพนักงานและ HR – ใช้ง่าย รวดเร็ว และปลอดภัย</p>
      <div className="w-full max-w-xl relative mb-8">
        <Input type="text" placeholder="🔍 ค้นหาบริการ เช่น ขอหนังสือรับรอง" className="pr-10" />
        <Search className="absolute right-3 top-3 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link href="/retired" className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg">👨‍⚕️ <p className="mt-2 font-semibold">ผู้สูงอายุ</p></Link>
        <Link href="/employee" className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg">👩‍💼 <p className="mt-2 font-semibold">พนักงานทั่วไป</p></Link>
        <Link href="/hr" className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg">👩‍💻 <p className="mt-2 font-semibold">เจ้าหน้าที่ HR</p></Link>
        <Link href="/chat" className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg">💬 <p className="mt-2 font-semibold">แชท</p></Link>
      </div>
    </div>
  );
}
