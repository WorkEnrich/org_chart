# Organization Chart API

مخطط تنظيمي تفاعلي يمكن التحكم فيه من خلال JavaScript API.

## 🚀 الميزات

- **JavaScript API** للتحكم الكامل في المخطط
- **تحميل البيانات ديناميكياً** من أي مصدر
- **البحث والتصفية** المتقدم
- **توسيع وطي العقد** برمجياً
- **التركيز على موظف محدد**
- **إحصائيات مفصلة**

## 📋 API Reference

### التهيئة الأساسية

```javascript
// انتظار جاهزية API
window.addEventListener('OrgChartReady', function() {
  // تعيين بيانات المخطط
  window.OrgChartAPI.setData(employeeData, 'orgChart');
});
```

### دوال التحكم المتاحة

#### `setData(data: Employee[], chartType: string)`
تعيين بيانات المخطط (يحديث المحتوى في كل مرة)
```javascript
window.OrgChartAPI.setData([
  {
    id: 'emp1',
    name: 'أحمد محمد',
    position: 'المدير التنفيذي',
    department: 'Executive',
    level: 1,
    email: 'ahmed@company.com',
    phone: '+966501234567',
    avatar: 'https://example.com/avatar.jpg'
  }
], 'orgChart');
```

#### `init(data: Employee[], chartType: string)` - مهجورة
دالة قديمة للتوافق مع الإصدارات السابقة (استخدم setData بدلاً منها)
```javascript
window.OrgChartAPI.init(employeeData, 'orgChart'); // يعيد التوجيه إلى setData
```

#### `updateEmployees(data: Employee[])`
تحديث بيانات الموظفين
```javascript
window.OrgChartAPI.updateEmployees(newEmployeeData);
```

#### `expandNode(nodeId: string)`
توسيع عقدة محددة
```javascript
window.OrgChartAPI.expandNode('emp1');
```

#### `collapseNode(nodeId: string)`
طي عقدة محددة
```javascript
window.OrgChartAPI.collapseNode('emp1');
```

#### `expandAll()`
توسيع جميع العقد
```javascript
window.OrgChartAPI.expandAll();
```

#### `collapseAll()`
طي جميع العقد
```javascript
window.OrgChartAPI.collapseAll();
```

#### `searchEmployee(searchTerm: string)`
البحث عن موظف
```javascript
window.OrgChartAPI.searchEmployee('أحمد');
```

#### `filterByDepartment(department: string)`
تصفية حسب القسم
```javascript
window.OrgChartAPI.filterByDepartment('Engineering');
```

#### `resetFilters()`
إعادة تعيين جميع المرشحات
```javascript
window.OrgChartAPI.resetFilters();
```

#### `getStats()`
الحصول على إحصائيات المخطط
```javascript
const stats = window.OrgChartAPI.getStats();
console.log(stats);
// {
//   totalEmployees: 200,
//   departments: ['Executive', 'Engineering', 'Marketing'],
//   levels: [1, 2, 3, 4, 5, 6],
//   filteredCount: 200
// }
```

#### `focusOnEmployee(employeeId: string)`
التركيز على موظف محدد
```javascript
window.OrgChartAPI.focusOnEmployee('emp5');
```

## 🏗️ هيكل بيانات الموظف

```typescript
interface Employee {
  id: string;                 // معرف فريد
  name: string;              // اسم الموظف
  position: string;          // المنصب
  department: string;        // القسم
  level: number;            // المستوى الهرمي
  email: string;            // البريد الإلكتروني
  phone: string;            // رقم الهاتف
  avatar: string;           // رابط الصورة
  managerId?: string;       // معرف المدير المباشر
}
```

## 🎨 الأقسام المدعومة

- **Executive**: بنفسجي
- **Engineering**: أزرق
- **Marketing**: أخضر
- **Sales**: برتقالي
- **Finance**: أحمر
- **HR**: وردي
- **Operations**: نيلي

## 🔧 أمثلة الاستخدام

### من تطبيق React
```javascript
// في useEffect أو componentDidMount
useEffect(() => {
  if (window.OrgChartAPI) {
    window.OrgChartAPI.setData(employeeData, 'orgChart');
  }
}, []);
```

### من تطبيق Vue
```javascript
mounted() {
  window.addEventListener('OrgChartReady', () => {
    window.OrgChartAPI.setData(this.employees, 'orgChart');
  });
}
```

### من تطبيق Angular
```typescript
ngOnInit() {
  window.addEventListener('OrgChartReady', () => {
    (window as any).OrgChartAPI.setData(this.employees, 'orgChart');
  });
}
```

### من PHP/Laravel
```html
<script>
window.addEventListener('OrgChartReady', function() {
  fetch('/api/employees')
    .then(response => response.json())
    .then(data => {
      window.OrgChartAPI.setData(data, 'orgChart');
    });
});
</script>
```

## 🚀 التشغيل

```bash
npm install
npm run dev
```

## 📦 البناء للإنتاج

```bash
npm run build
```

## 🌐 الاستخدام في مشاريع أخرى

يمكنك تضمين هذا المخطط في أي مشروع عبر iframe أو تضمينه مباشرة:

```html
<iframe 
  src="https://your-org-chart-url.com" 
  width="100%" 
  height="600px"
  frameborder="0">
</iframe>

<script>
// التواصل مع iframe
const iframe = document.querySelector('iframe');
iframe.onload = function() {
  iframe.contentWindow.OrgChartAPI.setData(yourEmployeeData, 'orgChart');
};
</script>
```