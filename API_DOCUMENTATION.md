# Organization Chart API - دليل شامل

## 🚀 التهيئة الأساسية

```javascript
// انتظار جاهزية API
window.addEventListener('OrgChartReady', function() {
  console.log('✅ OrgChart API جاهز للاستخدام');
  
  // تهيئة المخطط بالبيانات
  window.OrgChartAPI.init(employeeData);
});
```

## 📊 شكل البيانات المطلوبة

### Employee Object Structure
```javascript
const employee = {
  id: "emp1",                    // string - معرف فريد (مطلوب)
  name: "أحمد محمد علي",           // string - اسم الموظف (مطلوب)
  position: "المدير التنفيذي",     // string - المنصب (مطلوب)
  department: "Executive",       // string - القسم (مطلوب)
  level: 1,                     // number - المستوى الهرمي (مطلوب)
  email: "ahmed@company.com",    // string - البريد الإلكتروني (اختياري)
  phone: "+966501234567",       // string - رقم الهاتف (اختياري)
  avatar: "https://...",        // string - رابط الصورة (اختياري)
  managerId: "emp0"             // string - معرف المدير المباشر (اختياري للجذر)
};
```

### مثال كامل للبيانات
```javascript
const employeeData = [
  // المدير التنفيذي (الجذر)
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
    avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg",
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
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
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
    avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg",
    managerId: "cto-001"
  }
];
```

## 🎛️ جميع الدوال المتاحة

### 1. `init(data: Employee[])`
**الوصف:** تهيئة المخطط بالبيانات الأساسية
```javascript
window.OrgChartAPI.init(employeeData);
```

### 2. `updateEmployees(data: Employee[])`
**الوصف:** تحديث بيانات الموظفين بالكامل
```javascript
const newData = [...employeeData, newEmployee];
window.OrgChartAPI.updateEmployees(newData);
```

### 3. `expandNode(nodeId: string)`
**الوصف:** توسيع عقدة محددة لإظهار التابعين
```javascript
window.OrgChartAPI.expandNode('ceo-001');
```

### 4. `collapseNode(nodeId: string)`
**الوصف:** طي عقدة محددة لإخفاء التابعين
```javascript
window.OrgChartAPI.collapseNode('cto-001');
```

### 5. `expandAll()`
**الوصف:** توسيع جميع العقد في المخطط
```javascript
window.OrgChartAPI.expandAll();
```

### 6. `collapseAll()`
**الوصف:** طي جميع العقد في المخطط
```javascript
window.OrgChartAPI.collapseAll();
```

### 7. `searchEmployee(searchTerm: string)`
**الوصف:** البحث عن موظف بالاسم أو المنصب أو البريد
```javascript
window.OrgChartAPI.searchEmployee('أحمد');
window.OrgChartAPI.searchEmployee('مطور');
window.OrgChartAPI.searchEmployee('ahmed@company.com');
```

### 8. `filterByDepartment(department: string)`
**الوصف:** تصفية الموظفين حسب القسم
```javascript
window.OrgChartAPI.filterByDepartment('Engineering');
window.OrgChartAPI.filterByDepartment('Marketing');
window.OrgChartAPI.filterByDepartment('Sales');
```

### 9. `resetFilters()`
**الوصف:** إعادة تعيين جميع المرشحات والبحث
```javascript
window.OrgChartAPI.resetFilters();
```

### 10. `getStats()`
**الوصف:** الحصول على إحصائيات المخطط
```javascript
const stats = window.OrgChartAPI.getStats();
console.log(stats);

// النتيجة:
{
  totalEmployees: 150,
  departments: ['Executive', 'Engineering', 'Marketing', 'Sales', 'Finance', 'HR'],
  levels: [1, 2, 3, 4, 5],
  filteredCount: 150
}
```

### 11. `focusOnEmployee(employeeId: string)`
**الوصف:** التركيز على موظف محدد وتوسيع المسار إليه
```javascript
window.OrgChartAPI.focusOnEmployee('dev-001');
```

## 🏢 الأقسام المدعومة والألوان

| القسم | اللون | الكود |
|-------|-------|-------|
| Executive | بنفسجي | `#a855f7` |
| Engineering | أزرق | `#3b82f6` |
| Marketing | أخضر | `#10b981` |
| Sales | برتقالي | `#f59e0b` |
| Finance | أحمر | `#ef4444` |
| HR | وردي | `#ec4899` |
| Operations | نيلي | `#6366f1` |

## 🔧 أمثلة الاستخدام من لغات مختلفة

### من PHP/Laravel
```php
<!DOCTYPE html>
<html>
<head>
    <title>Organization Chart</title>
</head>
<body>
    <iframe src="https://your-org-chart-url.com" width="100%" height="600px"></iframe>
    
    <script>
    window.addEventListener('OrgChartReady', function() {
        // جلب البيانات من API
        fetch('/api/employees')
            .then(response => response.json())
            .then(data => {
                window.OrgChartAPI.init(data);
            });
    });
    </script>
</body>
</html>
```

### من Python/Django
```python
# views.py
from django.shortcuts import render
from django.http import JsonResponse
from .models import Employee

def org_chart_data(request):
    employees = Employee.objects.all()
    data = []
    for emp in employees:
        data.append({
            'id': str(emp.id),
            'name': emp.name,
            'position': emp.position,
            'department': emp.department,
            'level': emp.level,
            'email': emp.email,
            'phone': emp.phone,
            'avatar': emp.avatar.url if emp.avatar else None,
            'managerId': str(emp.manager.id) if emp.manager else None
        })
    return JsonResponse(data, safe=False)
```

```html
<!-- template.html -->
<script>
window.addEventListener('OrgChartReady', function() {
    fetch('{% url "org_chart_data" %}')
        .then(response => response.json())
        .then(data => {
            window.OrgChartAPI.init(data);
        });
});
</script>
```

### من Node.js/Express
```javascript
// server.js
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.findAll();
        const formattedData = employees.map(emp => ({
            id: emp.id,
            name: emp.name,
            position: emp.position,
            department: emp.department,
            level: emp.level,
            email: emp.email,
            phone: emp.phone,
            avatar: emp.avatar,
            managerId: emp.managerId
        }));
        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

```html
<!-- client.html -->
<script>
window.addEventListener('OrgChartReady', function() {
    fetch('/api/employees')
        .then(response => response.json())
        .then(data => {
            window.OrgChartAPI.init(data);
        });
});
</script>
```

### من React
```jsx
import { useEffect, useState } from 'react';

function MyComponent() {
    const [employees, setEmployees] = useState([]);
    
    useEffect(() => {
        const handleOrgChartReady = () => {
            if (window.OrgChartAPI && employees.length > 0) {
                window.OrgChartAPI.init(employees);
            }
        };
        
        window.addEventListener('OrgChartReady', handleOrgChartReady);
        
        // جلب البيانات
        fetchEmployees().then(setEmployees);
        
        return () => {
            window.removeEventListener('OrgChartReady', handleOrgChartReady);
        };
    }, [employees]);
    
    return (
        <iframe 
            src="https://your-org-chart-url.com" 
            width="100%" 
            height="600px"
        />
    );
}
```

## 🎯 أمثلة متقدمة

### تحديث البيانات في الوقت الفعلي
```javascript
// تحديث دوري كل 30 ثانية
setInterval(() => {
    fetch('/api/employees')
        .then(response => response.json())
        .then(data => {
            window.OrgChartAPI.updateEmployees(data);
        });
}, 30000);
```

### التحكم التفاعلي
```javascript
// أزرار التحكم
document.getElementById('expandAll').onclick = () => {
    window.OrgChartAPI.expandAll();
};

document.getElementById('collapseAll').onclick = () => {
    window.OrgChartAPI.collapseAll();
};

document.getElementById('searchInput').oninput = (e) => {
    window.OrgChartAPI.searchEmployee(e.target.value);
};

document.getElementById('departmentFilter').onchange = (e) => {
    window.OrgChartAPI.filterByDepartment(e.target.value);
};
```

### عرض الإحصائيات
```javascript
function updateStats() {
    const stats = window.OrgChartAPI.getStats();
    
    document.getElementById('totalEmployees').textContent = stats.totalEmployees;
    document.getElementById('totalDepartments').textContent = stats.departments.length;
    document.getElementById('filteredCount').textContent = stats.filteredCount;
}

// تحديث الإحصائيات عند تغيير البيانات
window.addEventListener('OrgChartReady', updateStats);
```

## ⚠️ ملاحظات مهمة

1. **معرف فريد:** كل موظف يجب أن يكون له `id` فريد
2. **المدير المباشر:** `managerId` يجب أن يشير إلى `id` موجود
3. **الجذر:** الموظفين بدون `managerId` يعتبرون جذور
4. **الصور:** إذا لم تُحدد `avatar`، سيتم إنشاء صورة تلقائية
5. **الأقسام:** استخدم الأقسام المدعومة للحصول على ألوان صحيحة

## 🔗 روابط مفيدة

- **الموقع المنشور:** https://organization-chart-w-9rab.bolt.host
- **كود المصدر:** متاح في المشروع
- **الدعم:** اتصل بالفريق التقني