import { useEffect, useState } from 'react';
import { EventBus } from '@/EventBus';
import { Button } from '@/components/ui/button';

export const TramOverlay = () => {
    // ESTADOS DEL OVERLAY
    const [isOpen, setIsOpen] = useState(false); // Controla si el overlay está activo
    const [currentTileId, setCurrentTileId] = useState<string | null>(null); // ID de la estación donde caíste
    const [selectedTram, setSelectedTram] = useState<any>(null); // Datos de la estación destino seleccionada

    const bouncyAnimation = "transition-all duration-150 ease-bouncy hover:scale-105 active:scale-95";
	const stripedBackgroundStyle = { backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)),
            repeating-linear-gradient(
                -45deg,
                #ffffff,
                #ffffff 20px,
                #f3f4f6 20px,
                #f3f4f6 40px )`,
        backgroundSize: 'cover'
    };


    useEffect(() => {
        // 1. EVENTO DE APERTURA: Viene desde CornerOverlay al pulsar "Gestionar Desplazamiento"
        const handleOpen = (data: { currentTileId: string }) => {
            setCurrentTileId(data.currentTileId);
            setIsOpen(false);
            setSelectedTram(null);
            
            // Emitimos eventos hacia Phaser (Board.ts) para preparar el tablero
            EventBus.emit('dark-mode', true); // Oscurece todo el mapa
            EventBus.emit('start-tram-selection'); // Avisa a Phaser de que ilumine los tranvías y espere clics
        };

        // 2. EVENTO DE SELECCIÓN: Viene desde Phaser cuando el jugador pulsa una casilla iluminada
        const handleTramSelected = (tileData: any) => {
			console.log("entré a handleTramSelected");
            if (!isOpen) {
				console.log("no está open");
                // Guardamos la casilla seleccionada para mostrar el modal de confirmación
                setSelectedTram(tileData);
				setIsOpen(true);
            }
        };

        // Suscripción a eventos
        EventBus.on('open-tram-overlay', handleOpen);
        EventBus.on('tram-tile-selected', handleTramSelected);
        
        return () => {
            EventBus.off('open-tram-overlay', handleOpen);
            EventBus.off('tram-tile-selected', handleTramSelected);
        };
    }, [isOpen]);

    // Reiniciar selección del viaje y limpiar el estado
    const reOpenOverlay = () => {
        setIsOpen(false);
        setSelectedTram(null);
        
        // Emitimos eventos hacia Phaser (Board.ts) para preparar el tablero
        EventBus.emit('dark-mode', true); // Oscurece todo el mapa
        EventBus.emit('start-tram-selection'); // Avisa a Phaser de que ilumine los tranvías y espere clics
    };

    // Función para confirmar y ejecutar el viaje
    const confirmTramTravel = () => {
		console.log("dentro de tram travel");
        // Si eliges la misma estación en la que estás, el coste es 0€. Si es otra, 50€.
        const cost = (selectedTram.id === currentTileId) ? 0 : 50;
		console.log(selectedTram.id)
        
		console.log("coste elegido");
        // Avisamos a Phaser para que mueva la ficha y al backend para cobrar
        EventBus.emit('execute-tram-travel', {
			targetId: selectedTram.id, 
            cost: cost 
		});
        
		console.log("tras emtir execute-tram-travel");

        // Avisamos a Phaser de que vuelva a la normalidad
		setIsOpen(false);
		setSelectedTram(null);
        setCurrentTileId(null);
        EventBus.emit('dark-mode', false);
		console.log("fin confirmTramTravel");
    };

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            
            {/* FASE 2: MODAL DE CONFIRMACIÓN */}
            {/* Aparece en el centro cuando Phaser detecta el clic en una casilla de tranvía.
                Aquí 'pointer-events-auto' bloquea el fondo para que no pueda seguir clicando el tablero. */}
            {selectedTram && (
		<div className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
			{/* Contenedor con ancho fijo para asegurar que el texto y botones respiren */}
			<div className="w-[350px] animate-in zoom-in-95 duration-300 ease-out">
				<div
					className="rounded-[40px] flex flex-col overflow-hidden shadow-2xl border-2 border-gray-200"
					style={stripedBackgroundStyle}
				>
					{/* Contenido centrado con padding equilibrado */}
					<div className="flex flex-col items-center gap-8 p-10 text-center">

						<div className="space-y-2">
							<h3 className="text-2xl font-black italic uppercase text-slate-800 tracking-tighter leading-tight">
								{'Estación de tranvía'}
							</h3>
							<p className="text-[12px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
								{selectedTram.id === currentTileId ? 'Tu estación actual' : 'Estación Destino'}
							</p>
						</div>

						<div className="flex flex-col gap-4 w-full">
							{/* Botón de Acción Principal */}
							<Button
								onClick={confirmTramTravel}
								className={`w-full h-[60px] bg-[var(--color-primary)] text-[var(--color-text)] font-black uppercase text-[14px] tracking-wide rounded-full shadow-lg flex items-center justify-center px-4 ${bouncyAnimation}`}
							>
								<span className="leading-tight">
									{selectedTram.id === currentTileId
										? 'Permanecer aquí'
										: 'Cambiar de estación (50M)'}
								</span>
							</Button>

							{/* Botón de Cancelar / Volver */}
							<Button
								onClick={reOpenOverlay}
								className={`w-full h-[60px] bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase text-[14px] tracking-wider rounded-full border border-red-500/20 transition-all ${bouncyAnimation}`}
							>
								Elegir otra estación
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
        )}
        </div>
    );
};
