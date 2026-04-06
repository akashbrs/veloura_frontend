import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

const SizeGuidePage = () => {
    const sizeTables = [
        {
            title: "Men's Top Wear",
            headers: ["Size", "Chest (in)", "Waist (in)", "Shoulder (in)"],
            rows: [
                ["S", "36-38", "30-32", "17.5"],
                ["M", "38-40", "32-34", "18.5"],
                ["L", "40-42", "34-36", "19.5"],
                ["XL", "42-44", "36-38", "20.5"],
            ]
        },
        {
            title: "Women's Top Wear",
            headers: ["Size", "Bust (in)", "Waist (in)", "Hip (in)"],
            rows: [
                ["XS", "32-33", "25-26", "35-36"],
                ["S", "34-35", "27-28", "37-38"],
                ["M", "36-37", "29-30", "39-40"],
                ["L", "38-40", "31-33", "41-43"],
            ]
        }
    ];

    return (
        <div className="bg-[#fcfbf9] min-h-screen pt-32 pb-20">
            <div className="vx-container max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#f0eeec] rounded-[2.5rem] p-8 md:p-16 shadow-sm"
                >
                    <span className="inline-block px-4 py-1.5 bg-[#f0eeec] text-[#a0a09e] text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                        Support Guide
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-12 tracking-tight italic">Find Your Perfect Fit</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                        <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                            <div className="flex items-center gap-3 text-emerald-600 font-bold mb-4 uppercase tracking-widest text-xs">
                                <FiCheck /> How to measure
                            </div>
                            <ul className="space-y-4 text-sm text-emerald-800/70 font-medium">
                                <li>• <span className="text-emerald-900 font-bold">Chest/Bust</span>: Measure around the fullest part, keeping the tape horizontal.</li>
                                <li>• <span className="text-emerald-900 font-bold">Waist</span>: Measure around the narrowest part (typically where your body bends side to side).</li>
                                <li>• <span className="text-emerald-900 font-bold">Hips</span>: Measure around the fullest part of your hips.</li>
                            </ul>
                        </div>
                        <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-center">
                            <p className="text-amber-900/70 text-sm font-medium leading-relaxed italic m-0">
                                "A better fit means a better look. Use our smart sizing tool in your profile to never worry about charts again."
                            </p>
                        </div>
                    </div>

                    {sizeTables.map((table, idx) => (
                        <div key={idx} className="mb-16 last:mb-0">
                            <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">{table.title}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#f0eeec]">
                                            {table.headers.map((h, i) => (
                                                <th key={i} className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-[#aaa]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.rows.map((row, i) => (
                                            <tr key={i} className="border-b border-[#f0eeec] hover:bg-[#fcfbf9] transition-colors">
                                                {row.map((cell, j) => (
                                                    <td key={j} className="py-5 px-4 text-sm font-bold text-[#1a1a1a]">{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default SizeGuidePage;
