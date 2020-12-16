import React, { useMemo } from 'react';

function Footer() {
	const FooterStyle = useMemo(
		() => ({
			height: '100px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: '1rem',
		}),
		[],
	);

	return (
		<div
			style={FooterStyle}
		>
			<p> &copy; Copyright 김동휘 & 김형욱 & 이다원</p>
		</div>
	);
}

export default Footer;
