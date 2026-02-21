const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'src', 'utils', 'mockData.js');
let content = fs.readFileSync(mockDataPath, 'utf8');

const validImages = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532453288672-3a27e9be2efd?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528343105740-ff8ae641c888?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501162943152-edab3d50df5b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524143878510-ce2b5eeb59dc?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550583724-b2692bc1ffed?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507133750073-7b47a0631f4a?q=80&w=1000&auto=format&fit=crop"
];

let idx = 0;
content = content.replace(/image:\s*"[^"]+"/g, () => {
    const url = validImages[idx % validImages.length];
    idx++;
    return `image: "${url}"`;
});

fs.writeFileSync(mockDataPath, content);
console.log("Images updated successfully!");
