import { useState, useEffect } from 'react';
import { subscribe, unsubscribe } from './resources/API';

export function Effects(props: { sourceId: string }) {
    // Инициализируем состояние как null, чтобы отличать "нет сообщений" от пустой строки
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        // При смене источника (или при первом рендере) сбрасываем сообщение
        setMessage(null);

        // Создаем функцию-обработчик, которая будет обновлять стейт
        const handleNewMessage = (newMessage: string) => {
            setMessage(newMessage);
        };

        // Подписываемся на изменения статуса пользователя
        subscribe(props.sourceId, handleNewMessage);

        // Возвращаем функцию очистки (cleanup).
        // Она вызовется, когда компонент удалится или изменится sourceId,
        // чтобы правильно отписаться и не оставлять "фоновых" слушателей.
        return () => {
            unsubscribe(props.sourceId, handleNewMessage);
        };
    }, [props.sourceId]); // Эффект перезапускается только при изменении sourceId

    // Выводим название источника и сообщение (или -1, если сообщения еще нет)
    return (
        <div>
            {props.sourceId}: {message !== null ? message : '-1'}
        </div>
    );
}
