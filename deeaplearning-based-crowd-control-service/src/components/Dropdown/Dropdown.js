import React, { useEffect, useRef } from 'react';
import styles from './Dropdown.module.css';

const Dropdown = (props) => {
    const [visibilityAnimation, setVisibilityAnimation] = React.useState(false);
    const [repeat, setRepeat] = React.useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (props.visibility) {
            clearTimeout(repeat);
            setRepeat(null);
            setVisibilityAnimation(true);
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            setRepeat(setTimeout(() => {
                setVisibilityAnimation(false);
            }, 400));
            return () => {
                document.removeEventListener('mousedown', handleOutsideClick);
            };
        }
    }, [props.visibility]);

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            props.onClose();
        }
    };

    const handleItemClick = (item) => {
        console.log(item);
        props.onClose(); // 드롭다운을 닫기 위해 호출
    };

    return (
        <article
            ref={dropdownRef}
            className={`${styles.dropdown} ${props.visibility ? styles.slideFadeIn : styles.slideFadeOut}`}
        >
            {visibilityAnimation && (
                <ul>
                    <li onClick={() => handleItemClick('제1전시관')}>제1전시관</li>
                    <li onClick={() => handleItemClick('제2전시관')}>제2전시관</li>
                    <li onClick={() => handleItemClick('제3전시관')}>제3전시관</li>
                    <li onClick={() => handleItemClick('제4전시관')}>제4전시관</li>
                </ul>
            )}
        </article>
    );
};

export default Dropdown;

