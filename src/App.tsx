import { useState, useEffect, useRef } from 'react';
import { Fuel, Car, DollarSign, Droplets, Zap } from 'lucide-react';

type FuelType = {
  name: string;
  price: number;
  color: string;
  icon: string;
};

type VehicleType = {
  name: string;
  tankSize: number;
  icon: string;
  description: string;
};

const FUEL_PRICE_LAST_UPDATED = '00:00 27/03/2026';

const fuelTypes: FuelType[] = [
  { name: 'Xăng RON 95-III', price: 24330, color: 'bg-red-500', icon: '⛽' },
  { name: 'Xăng E5 RON 92', price: 23320, color: 'bg-orange-500', icon: '🔥' },
  { name: 'Dầu Diesel', price: 35440, color: 'bg-yellow-600', icon: '💨' },
];

const vehicleTypes: VehicleType[] = [
  // Xe tay ga
  { name: 'Air Blade', tankSize: 5.5, icon: '🛵', description: 'Xe tay ga phổ thông' },
  { name: 'Vision', tankSize: 5.2, icon: '🛵', description: 'Xe tay ga nhỏ gọn' },
  { name: 'SH Mode', tankSize: 5.5, icon: '🛵', description: 'Xe tay ga cao cấp' },
  { name: 'SH 150i', tankSize: 7.1, icon: '🛵', description: 'Xe tay ga sang chảnh' },
  { name: 'Lead 125', tankSize: 6.0, icon: '🛵', description: 'Xe tay ga thanh lịch' },
  { name: 'Vario 160', tankSize: 5.5, icon: '🛵', description: 'Xe tay ga thể thao' },
  { name: 'Janus', tankSize: 4.2, icon: '🛵', description: 'Xe tay ga nữ tính' },
  { name: 'NVX 155', tankSize: 6.6, icon: '🛵', description: 'Xe tay ga mạnh mẽ' },
  // Xe số
  { name: 'Winner X', tankSize: 4.5, icon: '🏍️', description: 'Xe số thể thao' },
  { name: 'Wave Alpha', tankSize: 3.7, icon: '🏍️', description: 'Xe số tiết kiệm' },
  { name: 'Wave RSX', tankSize: 3.7, icon: '🏍️', description: 'Xe số trẻ trung' },
  { name: 'Sirius', tankSize: 4.2, icon: '🏍️', description: 'Xe số bền bỉ' },
  { name: 'Exciter 155', tankSize: 5.4, icon: '🏍️', description: 'Xe côn tay đua' },
  { name: 'Raider 150', tankSize: 5.0, icon: '🏍️', description: 'Xe côn tay Suzuki' },
  // Ô tô
  { name: 'Ô tô', tankSize: 50, icon: '🚗', description: 'Xe hơi 4 bánh' },
  // Easter egg
  { name: 'Xe đạp', tankSize: 0, icon: '🚲', description: 'Chạy bằng cơm, không cần xăng 😂' },
];

function App() {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>(fuelTypes[0]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(vehicleTypes[0]);
  const [liters, setLiters] = useState<number>(0);
  const [isPumping, setIsPumping] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [fillLevel, setFillLevel] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPumping) {
      intervalRef.current = window.setInterval(() => {
        setLiters((prev) => {
          const newLiters = Math.min(prev + 0.1, selectedVehicle.tankSize);
          if (newLiters >= selectedVehicle.tankSize) {
            setIsPumping(false);
          }
          return newLiters;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPumping, selectedVehicle.tankSize]);

  useEffect(() => {
    setTotalCost(liters * selectedFuel.price);
    setFillLevel(selectedVehicle.tankSize > 0 ? (liters / selectedVehicle.tankSize) * 100 : 0);
  }, [liters, selectedFuel.price, selectedVehicle.tankSize]);

  const handleStartStop = () => {
    setIsPumping(!isPumping);
  };

  const handleReset = () => {
    setIsPumping(false);
    setLiters(0);
    setTotalCost(0);
    setFillLevel(0);
  };

  const handleVehicleChange = (vehicle: VehicleType) => {
    if (!isPumping) {
      setSelectedVehicle(vehicle);
      setLiters(0);
      setTotalCost(0);
      setFillLevel(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Fuel className="w-12 h-12 text-orange-500" />
            Đổ Xăng Online
          </h1>
          <p className="text-slate-400 text-lg">Xăng đắt quá, đổ online cho đỡ tốn! 😅</p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Car className="w-6 h-6 text-blue-400" />
              Chọn phương tiện
            </h2>

            <div className="space-y-3 mb-8">
              {vehicleTypes.map((vehicle) => (
                <button
                  key={vehicle.name}
                  onClick={() => handleVehicleChange(vehicle)}
                  disabled={isPumping}
                  className={`w-full p-3 rounded-xl transition-all transform hover:scale-105 ${
                    selectedVehicle.name === vehicle.name
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/50'
                      : 'bg-slate-700/50 hover:bg-slate-700'
                  } ${isPumping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3 text-white">
                    <span className="text-2xl">{vehicle.icon}</span>
                    <div className="text-left flex-1">
                      <div className="font-semibold">{vehicle.name}</div>
                      <div className="text-xs text-slate-300">{vehicle.description}</div>
                    </div>
                    <div className="text-sm font-bold">{vehicle.tankSize > 0 ? `${vehicle.tankSize}L` : '♾️'}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Droplets className="w-6 h-6 text-blue-400" />
              Chọn loại xăng
            </h2>

            <div className="space-y-3 mb-8">
              {fuelTypes.map((fuel) => (
                <button
                  key={fuel.name}
                  onClick={() => !isPumping && setSelectedFuel(fuel)}
                  disabled={isPumping}
                  className={`w-full p-4 rounded-xl transition-all transform hover:scale-105 ${
                    selectedFuel.name === fuel.name
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/50'
                      : 'bg-slate-700/50 hover:bg-slate-700'
                  } ${isPumping ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{fuel.icon}</span>
                      <span className="font-semibold text-lg">{fuel.name}</span>
                    </div>
                    <span className="text-xl font-bold">{fuel.price.toLocaleString('vi-VN')}đ/L</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Xe đang chọn:</span>
                <span className="text-white font-bold">{selectedVehicle.name} {selectedVehicle.icon}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Dung tích bình:</span>
                <span className="text-blue-400 font-bold">{selectedVehicle.tankSize > 0 ? `${selectedVehicle.tankSize} lít` : 'Không có bình xăng 😅'}</span>
              </div>
              <div className="border-t border-slate-700 my-3"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-lg">Số lít đã đổ:</span>
                <span className="text-white text-3xl font-bold">{liters.toFixed(2)} L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Tổng tiền:
                </span>
                <span className="text-green-400 text-3xl font-bold">
                  {totalCost.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleStartStop}
                disabled={selectedVehicle.tankSize === 0 || liters >= selectedVehicle.tankSize}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  isPumping
                    ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/50'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {isPumping ? (
                  <>
                    <Zap className="w-6 h-6 animate-pulse" />
                    Dừng đổ
                  </>
                ) : (
                  <>
                    <Fuel className="w-6 h-6" />
                    Bắt đầu đổ
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                disabled={isPumping}
                className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Fuel className="w-6 h-6 text-blue-400" />
              Trạm xăng
            </h2>

            <div className="flex flex-col items-center justify-center h-[500px] relative">
              <div className="relative flex flex-col items-center">
                <div className="w-32 h-64 bg-slate-900/80 rounded-3xl border-4 border-slate-600 relative overflow-hidden shadow-inner">
                  <div
                    className={`absolute bottom-0 w-full transition-all duration-300 ${selectedFuel.color} opacity-80`}
                    style={{ height: `${fillLevel}%` }}
                  >
                    {isPumping && (
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-pulse"></div>
                    )}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl drop-shadow-lg z-10">
                      {fillLevel.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {isPumping && (
                  <div className="mt-4 flex gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}

                <div className="text-8xl mt-6">
                  <span className={isPumping ? 'animate-bounce inline-block' : 'inline-block'}>
                    {selectedVehicle.icon}
                  </span>
                </div>

                <div className="text-center mt-3">
                  <span className="text-white font-bold text-xl">{selectedVehicle.name}</span>
                  <div className="text-slate-400 text-sm">{selectedVehicle.description}</div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-slate-400 text-lg">
                  {selectedVehicle.tankSize === 0 ? '🚲 Xe đạp chạy bằng cơm thôi bạn ơi!' : isPumping ? '⚡ Đang đổ xăng...' : liters >= selectedVehicle.tankSize ? '✅ Đổ đầy rồi!' : '⏸️ Chờ bắt đầu'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm mb-2">💡 Mẹo: Đây chỉ là web giải trí, xăng thật vẫn phải ra trạm đổ nhé!</p>
          <p className="text-sm font-medium text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-full">🕐 Cập nhật giá lúc {FUEL_PRICE_LAST_UPDATED} — Petrolimex</p>
        </div>
      </div>
    </div>
  );
}

export default App;
