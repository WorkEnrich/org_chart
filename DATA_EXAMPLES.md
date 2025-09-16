# أمثلة البيانات لـ Organization Chart API

## 🎯 **مثال بسيط - موظف واحد (الجذر)**

```javascript
window.OrgChartAPI.setData([
  {
    id: "ceo-001",
    name: "سارة أحمد محمد",
    position: "المدير التنفيذي",
    department: "Executive",
    level: 1,
    email: "sarah@company.com",
    phone: "+966501234567",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  }
], 'orgChart');
```

## 🏢 **مثال متوسط - هيكل إداري (3 مستويات)**

```javascript
window.OrgChartAPI.setData([
  // المدير التنفيذي
  {
    id: "ceo-001",
    name: "سارة أحمد محمد",
    position: "المدير التنفيذي",
    department: "Executive",
    level: 1,
    email: "sarah@company.com",
    phone: "+966501234567",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  
  // المديرين التنفيذيين
  {
    id: "cto-001",
    name: "محمد علي حسن",
    position: "مدير التقنية",
    department: "Engineering",
    level: 2,
    email: "mohammed@company.com",
    phone: "+966501234568",
    avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "ceo-001"
  },
  
  {
    id: "cmo-001",
    name: "فاطمة خالد يوسف",
    position: "مدير التسويق",
    department: "Marketing",
    level: 2,
    email: "fatima@company.com",
    phone: "+966501234569",
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "ceo-001"
  },
  
  // الموظفين
  {
    id: "dev-001",
    name: "أحمد سالم محمود",
    position: "مطور أول",
    department: "Engineering",
    level: 3,
    email: "ahmed.dev@company.com",
    phone: "+966501234570",
    avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "cto-001"
  },
  
  {
    id: "marketing-001",
    name: "نورا عبدالله العلي",
    position: "أخصائي تسويق",
    department: "Marketing",
    level: 3,
    email: "nora@company.com",
    phone: "+966501234571",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "cmo-001"
  }
], 'orgChart');
```

## 🏭 **مثال كامل - شركة متكاملة**

```javascript
window.OrgChartAPI.setData([
  // المدير التنفيذي
  {
    id: "ceo-001",
    name: "سارة أحمد محمد",
    position: "المدير التنفيذي",
    department: "Executive",
    level: 1,
    email: "sarah@company.com",
    phone: "+966501234567",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },

  // المستوى الثاني - المديرين التنفيذيين
  {
    id: "cto-001",
    name: "محمد علي حسن",
    position: "مدير التقنية",
    department: "Engineering",
    level: 2,
    email: "mohammed@company.com",
    phone: "+966501234568",
    avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "ceo-001"
  },
  {
    id: "cmo-001",
    name: "فاطمة خالد يوسف",
    position: "مدير التسويق",
    department: "Marketing",
    level: 2,
    email: "fatima@company.com",
    phone: "+966501234569",
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "ceo-001"
  },
  {
    id: "cfo-001",
    name: "خالد محمد الأحمد",
    position: "المدير المالي",
    department: "Finance",
    level: 2,
    email: "khaled@company.com",
    phone: "+966501234570",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "ceo-001"
  },
  {
    id: "chro-001",
    name: "أمل عبدالرحمن",
    position: "مدير الموارد البشرية",
    department: "HR",
    level: 2,
    email: "amal@company.com",
    phone: "+966501234571",
    avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "ceo-001"
  },

  // المستوى الثالث - مديري الأقسام
  {
    id: "eng-manager-001",
    name: "أحمد سالم محمود",
    position: "مدير فريق التطوير",
    department: "Engineering",
    level: 3,
    email: "ahmed.dev@company.com",
    phone: "+966501234572",
    avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "cto-001"
  },
  {
    id: "marketing-manager-001",
    name: "نورا عبدالله العلي",
    position: "مدير التسويق الرقمي",
    department: "Marketing",
    level: 3,
    email: "nora@company.com",
    phone: "+966501234573",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "cmo-001"
  },

  // المستوى الرابع - الموظفين
  {
    id: "dev-001",
    name: "يوسف محمد الغامدي",
    position: "مطور واجهات أمامية",
    department: "Engineering",
    level: 4,
    email: "youssef@company.com",
    phone: "+966501234574",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "eng-manager-001"
  },
  {
    id: "dev-002",
    name: "ريم أحمد الشهري",
    position: "مطور خلفية",
    department: "Engineering",
    level: 4,
    email: "reem@company.com",
    phone: "+966501234575",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "eng-manager-001"
  },
  {
    id: "marketing-001",
    name: "عبدالله سعد القحطاني",
    position: "أخصائي وسائل التواصل",
    department: "Marketing",
    level: 4,
    email: "abdullah@company.com",
    phone: "+966501234576",
    avatar: "https://images.pexels.com/photos/1056553/pexels-photo-1056553.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    managerId: "marketing-manager-001"
  }
], 'orgChart');
```

## 📋 **هيكل البيانات المطلوب**

```javascript
{
  id: "معرف-فريد",              // string (مطلوب) - معرف فريد للموظف
  name: "اسم الموظف",            // string (مطلوب) - الاسم الكامل
  position: "المنصب",           // string (مطلوب) - المنصب الوظيفي
  department: "القسم",          // string (مطلوب) - اسم القسم
  level: 1,                    // number (مطلوب) - المستوى الهرمي (1-6)
  email: "email@company.com",   // string (اختياري) - البريد الإلكتروني
  phone: "+966501234567",      // string (اختياري) - رقم الهاتف
  avatar: "https://...",       // string (اختياري) - رابط الصورة
  managerId: "معرف-المدير"      // string (اختياري) - معرف المدير المباشر
}
```

## 🎨 **الأقسام المدعومة والألوان**

```javascript
// الأقسام المتاحة مع ألوانها
const departments = {
  "Executive": "بنفسجي",      // للإدارة العليا
  "Engineering": "أزرق",     // للتقنية والتطوير
  "Marketing": "أخضر",       // للتسويق
  "Sales": "برتقالي",        // للمبيعات
  "Finance": "أحمر",         // للمالية
  "HR": "وردي",             // للموارد البشرية
  "Operations": "نيلي"       // للعمليات
};
```

## 🔧 **أمثلة للاستخدام السريع**

```javascript
// مثال سريع - جرب في Console
window.OrgChartAPI.setData([
  {
    id: "test1",
    name: "اسمك هنا",
    position: "منصبك",
    department: "Executive",
    level: 1,
    email: "your@email.com",
    phone: "+966501234567",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
  }
], 'orgChart');

// إضافة موظف آخر
window.OrgChartAPI.setData([
  {
    id: "test1",
    name: "اسمك هنا",
    position: "منصبك",
    department: "Executive",
    level: 1,
    email: "your@email.com",
    phone: "+966501234567",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
  },
  {
    id: "test2",
    name: "موظف آخر",
    position: "مساعد",
    department: "Executive",
    level: 2,
    email: "assistant@email.com",
    phone: "+966501234568",
    avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg",
    managerId: "test1"
  }
], 'orgChart');
```

## ⚠️ **ملاحظات مهمة**

1. **المعرف الفريد:** كل موظف يجب أن يكون له `id` فريد
2. **المدير المباشر:** `managerId` يجب أن يشير إلى `id` موجود
3. **الجذر:** الموظفين بدون `managerId` يعتبرون في القمة
4. **المستويات:** من 1 (الأعلى) إلى 6 (الأدنى)
5. **الصور:** إذا لم تحدد `avatar`، سيتم إنشاء صورة تلقائية

جرب أي من هذه الأمثلة في Console! 🚀