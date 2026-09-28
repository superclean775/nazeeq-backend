module.exports = function(app, pool, upload) {
    app.post('/api/v1/stains/analyze', upload.single('image'), async (req, res) => {
        try {
            const productsQuery = await pool.query(`
                SELECT p.*, s.store_name 
                FROM products p 
                JOIN stores s ON p.store_id = s.id
            `);
            const availableProducts = productsQuery.rows;

            let userDesc = req.body.description || '';
            let lowerDesc = userDesc.toLowerCase();
            let matchedProduct = null;

            if (availableProducts.length > 0) {
                matchedProduct = availableProducts.find(p => 
                    (p.name && lowerDesc.includes(p.name.toLowerCase())) ||
                    (p.category && lowerDesc.includes(p.category.toLowerCase()))
                );
                
                if (!matchedProduct) {
                    matchedProduct = availableProducts[0];
                }
            } else {
                matchedProduct = { 
                    name: "General Cleaning Product", 
                    price: "0", 
                    store_name: "Nazeef Platform", 
                    description: "Standard multipurpose cleaner." 
                };
            }

            let diySolution = "Use a mixture of white vinegar, a little baking soda, and warm water, gently scrub with a clean cloth.";
            
            if (lowerDesc.includes('oil') || lowerDesc.includes('fat') || lowerDesc.includes('دهون') || lowerDesc.includes('زيت')) {
                diySolution = "Use warm water with a few drops of lemon and dish soap, let it sit for 3 minutes then wipe gently.";
            } else if (lowerDesc.includes('scale') || lowerDesc.includes('rust') || lowerDesc.includes('تكلس') || lowerDesc.includes('صدأ')) {
                diySolution = "Apply citric acid and white vinegar, let it fizz for 5 minutes, scrub with a brush and rinse with lukewarm water.";
            } else if (lowerDesc.includes('ink') || lowerDesc.includes('حبر')) {
                diySolution = "Dab gently with medical alcohol or a cloth soaked in vinegar, avoid harsh rubbing.";
            }

            res.json({
                status: 'success',
                data: {
                    detected_stain: userDesc || 'General issue',
                    commercial_product: {
                        name: matchedProduct.name,
                        price: matchedProduct.price + ' RY',
                        store: matchedProduct.store_name,
                        description: matchedProduct.description || 'Available cleaning solution.'
                    },
                    diy_solution: diySolution
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'Error processing image analysis' });
        }
    });
    // مسار المحادثة التفاعلية للرد على استفسارات العملاء
    app.post('/api/v1/stains/chat', async (req, res) => {
        try {
            const { message, stain_context } = req.body;
            let userMsg = (message || '').toLowerCase();
            
            let botReply = "أنا معك يا غالي، بخصوص استفسارك أنصحك باتباع الخطوات بحرص وإن شاء الله ستزول المشكلة تماماً. هل تحتاج تفاصيل أكثر عن طريقة الاستخدام؟";

            if (userMsg.includes('كم') || userMsg.includes('سعر') || userMsg.includes('تكلفة')) {
                botReply = "الأسعار موضحة بجانب كل منتج في قائمة المتاجر المتاحة، ويمكنك طلب المنتج مباشرة بضغطة زر.";
            } else if (userMsg.includes('آمن') || userMsg.includes('أطفال') || userMsg.includes('جلد')) {
                botReply = "نعم، الخلطات الطبيعية آمنة تماماً، وبالنسبة للمنتجات التجارية يفضل دائماً ارتداء قفازات الحماية وتجنب ملامستها للعينين.";
            } else if (userMsg.includes('ما يروح') || userMsg.includes('صعب') || userMsg.includes('عنيد')) {
                botReply = "إذا كانت البقعة قديمة وعنيدة جداً، جدر بنا تكرار الخليط الدافئ مرتين مع ترك المحلول يتفاعل لمدة 10 دقائق كاملة قبل الفرك بفرشاة خشنة.";
            }

            res.json({
                status: 'success',
                data: {
                    reply: botReply
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'Error in chat processing' });
        }
    });
};

module.exports = function(app, pool, upload) {
    // مسار تحليل البقع والمنتجات الأساسي
    app.post('/api/v1/stains/analyze', upload.single('image'), async (req, res) => {
        try {
            const productsQuery = await pool.query(`
                SELECT p.*, s.store_name 
                FROM products p 
                JOIN stores s ON p.store_id = s.id
            `);
            const availableProducts = productsQuery.rows;

            let userDesc = req.body.description || '';
            let lowerDesc = userDesc.toLowerCase();
            let matchedProduct = null;

            if (availableProducts.length > 0) {
                matchedProduct = availableProducts.find(p => 
                    (p.name && lowerDesc.includes(p.name.toLowerCase())) ||
                    (p.category && lowerDesc.includes(p.category.toLowerCase()))
                );
                if (!matchedProduct) matchedProduct = availableProducts[0];
            } else {
                matchedProduct = { 
                    name: "منظف عام متطور", 
                    price: "0", 
                    store_name: "منصة نظيف", 
                    description: "تركيبة قياسية متعددة الاستخدامات." 
                };
            }

            let diySolution = "للحصول على أفضل نتيجة عميقة، اصنع مزيجاً هندسياً من كوب ماء دافئ، ملعقتين من الخل الأبيض المركز، وملعقة صغيرة من بيكربونات الصوديوم. ضع المزيج على البقعة واتركه يتفاعل كيميائياً لمدة 5 دقائق لتفكيك الجزيئات الدهنية أو العضوية، ثم افرك بلطف بفرشاة ناعمة واشفط السوائل بقماش قطني نظيف.";
            
            if (lowerDesc.includes('دهون') || lowerDesc.includes('زيت') || lowerDesc.includes('oil') || lowerDesc.includes('fat')) {
                diySolution = "البقع الدهنية تتطلب إذابة كيميائية دقيقة: قم بتغطية البقعة بطبقة رقيقة من بيكربونات الصوديوم لامتصاص الفائض، ثم ركّز عليها قطرات من الخل الدافئ وسائل إزالة الدهون المركز. اترك التفاعل الثوري يحدث لمدة 7 دقائق حتى تنفصل الجزيئات الزيتية عن السطح، ثم امسحها بقطعة قماش مبللة بماء ساخن.";
            } else if (lowerDesc.includes('تكلس') || lowerDesc.includes('صدأ') || lowerDesc.includes('scale')) {
                diySolution = "للتكلسات الصعبة والصدأ: استخدم حمض الستريك الطبيعي مع الخل الأبيض الدافئ لتشكيل محلول حمضي مذيب للمعادن المتراكمة. اتركه يتفاعل لمدة 10 دقائق حتى يذوب التكلس تماماً، ثم افرك بفرشاة صلبة واشطف بماء فاتر لضمان استعادة لمعان السطح.";
            }

            res.json({
                status: 'success',
                data: {
                    detected_stain: userDesc || 'مشكلة عامة',
                    commercial_product: {
                        name: matchedProduct.name,
                        price: matchedProduct.price + ' ريال',
                        store: matchedProduct.store_name,
                        description: matchedProduct.description || 'حل احترافي معتمد.'
                    },
                    diy_solution: diySolution
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'خطأ في معالجة التحليل' });
        }
    });

    // مسار دردشة تفاعلي عميق ومخصص للاستفسارات التفصيلية
    app.post('/api/v1/stains/chat', async (req, res) => {
        try {
            const { message, context } = req.body;
            let userMsg = (message || '').toLowerCase();
            let botReply = "أنا خبير الحلول الهندسية والمنزلية معك يا غالي. بخصوص تفاصيل المعالجة، ننصح دائماً باختبار المحلول في زاوية مخفية أولاً للتأكد من تفاعل السطح، ثم تطبيق الخطوات بحرص. هل تواجه تحدياً في نوع معين من الأسطح أو تحتاج لمعرفة تركيز الخلطة؟";

            if (userMsg.includes('تفاصيل') || userMsg.includes('اكثر') || userMsg.includes('كيف') || userMsg.includes('اشتي')) {
                botReply = "السر في العمق الفني يكمن في 'زمن التفاعل' (Contact Time). ترك المحلول الحمضي أو القلوي يتغلغل لمدة تتراوح بين 5 إلى 10 دقائق يفتت الروابط الكيميائية للبقع المستعصية دون الحاجة لفرك عنيف قد يضر السطح. هل تحب أن أساعدك باختيار منتج تجاري جاهز من المتاجر المتاحة؟";
            } else if (userMsg.includes('سعر') || userMsg.includes('تكلفة') || userMsg.includes('كم')) {
                botReply = "تكاليف المنتجات التجارية معروضة بشفافية تامة بجانب كل منتج في قائمة المتاجر أدناه، وتتفاوت حسب الحجم والنوع لتناسب كافة الاحتياجات.";
            } else if (userMsg.includes('آمن') || userMsg.includes('أطفال') || userMsg.includes('جلد')) {
                botReply = "نعم بالكامل! الخلطات المنزلية (كالخل والليمون وبيكربونات الصوديوم) صديقة للبيئة وآمنة تماماً على العائلة والأطفال، بينما نوصي بارتداء قفازات واقية عند التعامل مع المنظفات الكيميائية المركزة.";
            }

            res.json({
                status: 'success',
                data: {
                    reply: botReply
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'خطأ في معالجة المحادثة' });
        }
    });
};

